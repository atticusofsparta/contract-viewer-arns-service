import { TX_ID_REGEX } from './constants';

export interface ArweaveWalletConnector {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getWalletAddress(): Promise<ArweaveTransactionID>;
}

export interface ArweaveDataProvider {
  // add isAddress method
  getTransactionStatus(id: ArweaveTransactionID): Promise<number>;
  getTransactionTags(
    id: ArweaveTransactionID,
  ): Promise<{ [x: string]: string }>;
  validateTransactionTags(params: {
    id: string;
    requiredTags?: {
      [x: string]: string[] | ArweaveTransactionID[]; // allowed values
    };
  }): Promise<void>;
  validateArweaveId(id: string): Promise<ArweaveTransactionID>;
  validateConfirmations(
    id: string,
    numberOfConfirmations?: number,
  ): Promise<void>;
  validateArweaveAddress(address: string): Promise<undefined | boolean>;
  getArBalance(wallet: ArweaveTransactionID): Promise<number>;
  getArPrice(data: number): Promise<number>;
  getCurrentBlockHeight(): Promise<number>;
}

export type TransactionHeaders = {
  id: string;
  signature: string;
  format: number;
  last_tx: string;
  owner: string;
  target: string;
  quantity: string;
  reward: string;
  data_size: string;
  data_root: string;
  tags: TransactionTag[];
};

export class ArweaveTransactionID implements Equatable<ArweaveTransactionID> {
  constructor(private readonly transactionId: string) {
    if (!TX_ID_REGEX.test(transactionId)) {
      throw new Error(
        'Transaction ID should be a 43-character, alphanumeric string potentially including "-" and "_" characters.',
      );
    }
  }

  [Symbol.toPrimitive](hint?: string): string {
    if (hint === 'number') {
      throw new Error('Transaction IDs cannot be interpreted as a number!');
    }

    return this.toString();
  }

  toString(): string {
    return this.transactionId;
  }

  equals(entityId: ArweaveTransactionID): boolean {
    return this.transactionId === entityId.transactionId;
  }
}

export interface Equatable<T> {
  equals(other: T): boolean;
}

export type TransactionTag = {
  name: string;
  value: string;
};

export interface TransactionCache {
  set(key: string, value: any): void;
  get(key: string): any;
  del(key: string): void;
  push(key: string, value: any): void;
}

export enum TRANSACTION_TYPES {
  LEASE = 'lease',
  BUY = 'permabuy',
}

export type ContractInteraction = {
  contractTxId: string;
  id: string;
  payload: {
    function: string;
    [x: string]: string;
  };
  valid: boolean;
  [x: string]: any;
};

export type PDNSRecordEntry = {
  contractTxId: string;
  tier: string;
  endTimestamp: number;
};

export type PDNSDomains = { [x: string]: PDNSRecordEntry };

export type AuctionSettings = {
  id: string;
  floorPriceMultiplier: number;
  startPriceMultiplier: number;
  auctionDuration: number;
  decayRate: number;
  decayInterval: number;
};

export type Auction = {
  auctionSettingsId: string;
  floorPrice: number;
  startPrice: number;
  contractTxId: string;
  startHeight: number;
  type: TRANSACTION_TYPES;
  tier: string;
  initiator: string;
  years?: number;
};

export type PDNSContractJSON = {
  records: PDNSDomains;
  fees: { [x: number]: number };
  tiers: {
    current: string[];
    history: Tier[];
  };
  auctions?: {
    [x: string]: Auction;
  };
  reserved: {
    [x: string]: {
      [x: string]: string | number;
      target: string;
      endTimestamp: number;
    };
  };
  settings: {
    auctions?: {
      current: string;
      history: AuctionSettings[];
    };
    [x: string]: any;
  };
  balances: { [x: string]: number };
  controllers: ArweaveTransactionID[];
  evolve: boolean | undefined;
  name: string;
  owner: ArweaveTransactionID | undefined;
  ticker: string;
  approvedANTSourceCodeTxs: string[];
};

export type PDNTContractJSON = {
  balances: { [x: string]: number };
  evolve: boolean | undefined;
  name: string;
  owner: string;
  controller: string;
  controllers?: string[];
  records: {
    '@': string | PDNTContractDomainRecord;
    [x: string]: string | PDNTContractDomainRecord;
  };
  ticker: string;
};

export type PDNTContractDomainRecord = {
  ttlSeconds: number;
  maxUndernames: number;
  transactionId: string;
};

export interface SmartweaveContractCache {
  getContractState<T extends PDNTContractJSON | PDNSContractJSON>(
    contractTxId: ArweaveTransactionID,
  ): Promise<T>;
  getContractBalanceForWallet(
    contractTxId: ArweaveTransactionID,
    wallet: ArweaveTransactionID,
  ): Promise<number>;
  getContractsForWallet(
    address: ArweaveTransactionID,
    type?: 'ant', // TODO: we may broaden this for other contract types
  ): Promise<{ ids: ArweaveTransactionID[] }>;
  getContractInteractions(
    contractTxId: ArweaveTransactionID,
  ): Promise<ContractInteraction[]>;
  getPendingContractInteractions(
    contractTxId: ArweaveTransactionID,
    key: string,
  ): Promise<ContractInteraction[]>;
}

export type Tier = {
  fee: number;
  id: string;
  settings: { maxUndernames: number } & { [x: string]: any };
};

export interface SmartweaveContractInteractionProvider {
  writeTransaction({
    walletAddress,
    contractTxId,
    payload,
    dryWrite,
  }: {
    walletAddress: ArweaveTransactionID;
    contractTxId: ArweaveTransactionID;
    payload: {
      function: string;
      [x: string]: any;
    };
    dryWrite?: boolean;
  }): Promise<ArweaveTransactionID | undefined>;
  deployContract({
    walletAddress,
    srcCodeTransactionId,
    initialState,
    tags,
  }: {
    walletAddress: ArweaveTransactionID;
    srcCodeTransactionId: ArweaveTransactionID;
    initialState: PDNTContractJSON;
    tags?: TransactionTag[];
  }): Promise<string>;
  registerAtomicName({
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
  }): Promise<string | undefined>;
}

export type SmartWeaveActionInput = {
  function: string;
  [x: string]: any;
};

export type SmartWeaveActionTags = [
  {
    name: 'App-Name';
    value: 'SmartWeaveAction';
  },
  {
    name: 'Contract';
    value: string;
  },
  {
    name: 'Input';
    value: string;
  },
] &
  TransactionTag[];


  export type Config = {
    gateway: string;
    serviceUrl: string;
    blockHeightRefreshRate: number;
    walletBalanceRefreshRate: number;
    arnsRegistryContractId: string;
    arnsRegistrySrcCodeId?: string;
    savedArnsContractIds?: string[];
    nameTokenSrcCodeIds?: string[];
  }
  