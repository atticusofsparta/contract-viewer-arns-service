import Arweave from 'arweave/node/common';
import { Tag } from 'arweave/node/lib/transaction';
import axios from 'axios';
import {
  ArWallet,
  LoggerFactory,
  SourceType,
  Warp,
  WarpFactory,
  defaultCacheOptions,
} from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import {
  ARNS_SERVICE_URL,
  ATOMIC_REGISTRATION_INPUT,
  PDNS_REGISTRY_ADDRESS,
  SMARTWEAVE_MAX_TAG_SPACE,
} from '../constants';
import {
  ArweaveTransactionID,
  ContractInteraction,
  PDNSContractJSON,
  PDNTContractJSON,
  SmartweaveContractCache,
  SmartweaveContractInteractionProvider,
  TRANSACTION_TYPES,
  TransactionCache,
  TransactionTag,
} from '../types';
import { LocalStorageCache } from './LocalStorageCache';
import {
  buildSmartweaveInteractionTags,
  byteSize,
  isDomainAuctionable,
} from './common';

LoggerFactory.INST.logLevel('error');

export class WarpDataProvider
  implements SmartweaveContractInteractionProvider, SmartweaveContractCache
{
  private _warp: Warp;
  private _cache: TransactionCache;

  constructor(
    arweave: Arweave,
    cache: TransactionCache = new LocalStorageCache(),
  ) {
    // using ar.io gateway and stick to L1 only transactions
    this._warp = WarpFactory.forMainnet(
      {
        ...defaultCacheOptions,
      },
      true,
      arweave,
    ).use(new DeployPlugin());
    this._cache = cache;
  }

  async getContractState<T extends PDNTContractJSON | PDNSContractJSON>(
    id: ArweaveTransactionID,
  ): Promise<T> {
    const contract = this._warp.contract(id.toString());
    const { cachedValue } = await contract.readState();

    if (!cachedValue.state) {
      throw Error('Failed to fetch state from Warp.');
    }

    return cachedValue.state as T;
  }

  async writeTransaction({
    walletAddress,
    contractTxId,
    payload,
    dryWrite = true,
  }: {
    walletAddress: ArweaveTransactionID;
    contractTxId: ArweaveTransactionID;
    payload: {
      function: string;
      [x: string]: any;
    };
    dryWrite?: boolean;
  }): Promise<ArweaveTransactionID | undefined> {
    const payloadSize = byteSize(JSON.stringify(payload));
    if (!payload) {
      throw Error('Payload cannot be empty.');
    }
    if (payloadSize > SMARTWEAVE_MAX_TAG_SPACE) {
      throw new Error(
        'Payload too large for tag space, reduce the size of the data in payload.',
      );
    }

    const contract = this._warp // eval options were required due to change in manifest. This is causing an issue where it is causing a delay for returning the txid due to the `waitForConfirmation` option. This should be removed from the eval manifest if we dont want to make the user wait.
      .contract(contractTxId.toString())
      .setEvaluationOptions({
            sourceType:"arweave" as SourceType,
            unsafeClient:"skip",
            internalWrites:true,
            useKVStorage:true,
            updateCacheForEachInteraction:true,
            maxInteractionEvaluationTimeSeconds:60,
            throwOnInternalWriteError:true,
            },
      )
      .connect('use_wallet');
    if (dryWrite) {
      const dryWriteResults = await contract.dryWrite(
        payload,
        walletAddress.toString(),
      );

      if (dryWriteResults.originalValidity?.valid === false) {
        throw new Error(
          `Contract interaction detected to be invalid: ${
            dryWriteResults?.originalErrorMessages
              ? Object.entries(dryWriteResults?.originalErrorMessages)
                  .map(([name, errorMessage]) => `${name}: ${errorMessage}`)
                  .join(',')
              : dryWriteResults.errorMessage
          }`,
        );
      }
    }
    const result = await contract.writeInteraction(payload, {
      disableBundling: true,
    });
    // TODO: check for dry write options on writeInteraction
    if (!result) {
      throw Error('No result from write interaction');
    }
    const { originalTxId } = result;

    if (!originalTxId) {
      throw Error('No transaction ID from write interaction');
    }

    this._cache.push(walletAddress.toString(), {
      id: originalTxId,
      contractTxId: contractTxId.toString(),
      payload,
      type: 'interaction',
    });

    return new ArweaveTransactionID(originalTxId);
  }

  async getContractBalanceForWallet(
    id: ArweaveTransactionID,
    wallet: ArweaveTransactionID,
  ) {
    const state = await this.getContractState(id);
    return state?.balances[wallet.toString()] ?? 0;
  }

  async deployContract({
    walletAddress,
    srcCodeTransactionId,
    initialState,
    tags = [],
  }: {
    walletAddress: ArweaveTransactionID;
    srcCodeTransactionId: ArweaveTransactionID;
    initialState: PDNTContractJSON;
    tags?: TransactionTag[];
  }): Promise<string> {
    const tagSize = byteSize(JSON.stringify(tags));

    if (!initialState) {
      throw new Error('Must have an initial state to deploy a contract');
    }

    if (tagSize > SMARTWEAVE_MAX_TAG_SPACE) {
      throw new Error(
        `tags too large for tag space, must be under ${SMARTWEAVE_MAX_TAG_SPACE} bytes.`,
      );
    }

    const deploymentPayload: {
      wallet: ArWallet;
      initState: string;
      srcTxId: string;
      tags: Tag[];
    } = {
      wallet: 'use_wallet',
      initState: JSON.stringify(initialState),
      srcTxId: srcCodeTransactionId.toString(),
      tags: tags.map((tag) => new Tag(tag.name, tag.value)),
    };

    const { contractTxId } = await this._warp.deployFromSourceTx(
      deploymentPayload,
      true, // disable bundling
    );

    if (!contractTxId) {
      throw new Error('Deploy failed.');
    }

    // TODO: emit event on successfully transaction
    this._cache.push(walletAddress.toString(), {
      contractTxId,
      id: contractTxId,
      payload: deploymentPayload,
      type: 'deploy',
    });
    // Pulls out registration interaction and caches it
    // TODO: make this able to cache batch interactions on multiple contracts at once.
    if (tags && contractTxId) {
      const input = tags.find((tag) => tag.name === 'Input')?.value;
      const contractId = tags.find((tag) => tag.name === 'Contract')?.value;
      if (!input || !contractId) {
        throw new Error(
          'Could not cache atomic transaction, missing info from tags.',
        );
      }
      const interactionPayload = JSON.parse(input);
      this._cache.push(walletAddress.toString(), {
        id: contractTxId,
        contractTxId: contractId,
        payload: interactionPayload,
        type: 'interaction',
      });
    }

    return contractTxId;
  }

  async registerAtomicName({
    walletAddress,
    registryId,
    srcCodeTransactionId,
    initialState,
    domain,
    type,
    years,
    reservedList,
  }: {
    walletAddress: ArweaveTransactionID;
    registryId: ArweaveTransactionID;
    srcCodeTransactionId: ArweaveTransactionID;
    initialState: PDNTContractJSON;
    domain: string;
    type: TRANSACTION_TYPES;
    years?: number;
    reservedList: string[];
  }): Promise<string | undefined> {
    if (!domain) {
      throw new Error('No domain provided');
    }

    const input = {
      ...ATOMIC_REGISTRATION_INPUT,
      name: domain,
      type,
      years,
      auction: isDomainAuctionable({
        domain,
        registrationType: type,
        reservedList,
      }),
    };
    const tags = buildSmartweaveInteractionTags({
      contractId: registryId,
      input,
    });

    const contract = this._warp // eval options were required due to change in manifest. This is causing an issue where it is causing a delay for returning the txid due to the `waitForConfirmation` option. This should be removed from the eval manifest if we dont want to make the user wait.
      .contract(PDNS_REGISTRY_ADDRESS)
      .setEvaluationOptions({
        sourceType:"arweave" as SourceType,
        unsafeClient:"skip",
        internalWrites:true,
        useKVStorage:true,
        updateCacheForEachInteraction:true,
        maxInteractionEvaluationTimeSeconds:60,
        throwOnInternalWriteError:true,
      })
      .connect('use_wallet');
    // because we are manually constructing the tags, we want to verify them immediately and always
    const dryWriteResults = await contract.dryWrite(
      input,
      walletAddress.toString(),
    );

    if (dryWriteResults.originalValidity?.valid === false) {
      throw new Error(
        `Contract interaction detected to be invalid: ${
          dryWriteResults?.originalErrorMessages
            ? Object.entries(dryWriteResults?.originalErrorMessages)
                .map(([name, errorMessage]) => `${name}: ${errorMessage}`)
                .join(',')
            : dryWriteResults.errorMessage
        }`,
      );
    }

    const result = await this.deployContract({
      walletAddress,
      srcCodeTransactionId,
      initialState,
      tags,
    });
    if (!result) {
      throw new Error('Could not deploy atomic contract');
    }
    return result;
  }

  /* eslint-disable */
  async getContractsForWallet(
    address: ArweaveTransactionID,
  ): Promise<{ ids: ArweaveTransactionID[] }> {
    throw Error('Not implemented!');
  }

  async getContractInteractions(
    id: ArweaveTransactionID,
  ): Promise<ContractInteraction[]> {
    const response = await axios.get(
      `${ARNS_SERVICE_URL}/contract/${id.toString()}/interactions`,
    );
    const interactions = response.data.interactions as ContractInteraction[];
    return interactions;
  }

  async getPendingContractInteractions(
    id: ArweaveTransactionID,
    key: string,
  ): Promise<ContractInteraction[]> {
    throw Error('Not implemented');
  }
  /* eslint-enable */
}
