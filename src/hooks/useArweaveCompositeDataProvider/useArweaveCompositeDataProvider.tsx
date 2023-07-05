import Arweave from 'arweave';
import { useEffect, useState } from 'react';

import { TX_ID_REGEX } from '../../constants';
import { useGlobalState } from '../../state/GlobalState';
import { ArweaveTransactionID } from '../../types';
import { ArweaveCompositeDataProvider } from '../../utils/ArweaveCompositeDataProvider';
import { PDNSContractCache } from '../../utils/PDNSContractCache';
import { SimpleArweaveDataProvider } from '../../utils/SimpleArweaveDataProvider';
import { WarpDataProvider } from '../../utils/WarpDataProvider';
import eventEmitter from '../../utils/events';



export function useArweaveCompositeProvider(): ArweaveCompositeDataProvider {

  const [{ config:{gateway, serviceUrl}, blockHeight, walletAddress }, dispatchGlobalState] =
    useGlobalState();

    const DEFAULT_ARWEAVE = new Arweave({
      host: gateway,
      protocol: 'https',
    });
    const defaultWarp = new WarpDataProvider(DEFAULT_ARWEAVE);
    const defaultArweave = new SimpleArweaveDataProvider(DEFAULT_ARWEAVE);
    const defaultContractCache = [
      new PDNSContractCache(`https://${serviceUrl}`),
      defaultWarp,
    ];
  const [arweaveDataProvider, setArweaveDataProvider] =
    useState<ArweaveCompositeDataProvider>(
      new ArweaveCompositeDataProvider(
        defaultArweave,
        defaultWarp,
        defaultContractCache,
      ),
    );

  useEffect(() => {
    dispatchNewArweave(gateway);
    arweaveDataProvider
      .getCurrentBlockHeight()
      .then((newBlockHieght: number) => {
        if (newBlockHieght === blockHeight) {
          return;
        }
        dispatchGlobalState({
          type: 'setBlockHieght',
          payload: newBlockHieght,
        });
      })
      .catch((error) => eventEmitter.emit('error', error));
  }, [gateway]);

  useEffect(() => {
    const blockInterval = setInterval(() => {
      arweaveDataProvider
        .getCurrentBlockHeight()
        .then((newBlockHieght: number) => {
          if (newBlockHieght === blockHeight) {
            return;
          }
          dispatchGlobalState({
            type: 'setBlockHieght',
            payload: newBlockHieght,
          });
        })
        .catch((error) => eventEmitter.emit('error', error));
    }, 120000); // get block hieght every 2 minutes or if registry or if wallet changes.

    return () => {
      clearInterval(blockInterval);
    };
  }, [walletAddress]);

  async function dispatchNewArweave(gateway: string): Promise<void> {
    try {
      const arweave = new Arweave({
        host: gateway,
        protocol: 'https',
      });

      const warpDataProvider = new WarpDataProvider(arweave);
      const arweaveDataProvider = new SimpleArweaveDataProvider(arweave);
      const contractCacheProviders = [
        new PDNSContractCache(`https://${serviceUrl}`),
        warpDataProvider,
      ];

      const arweaveCompositeDataProvider = new ArweaveCompositeDataProvider(
        arweaveDataProvider,
        warpDataProvider,
        contractCacheProviders,
      );
      setArweaveDataProvider(arweaveCompositeDataProvider);
    } catch (error) {
      eventEmitter.emit('error', error);
    }
  }

  return arweaveDataProvider;
}
