import { ArweaveWalletConnector, Config } from '../types';
import { GlobalState } from './GlobalState';

export type Action =
  | { type: 'setWalletAddress'; payload: string }
  | {
      type: 'setWallet';
      payload: ArweaveWalletConnector | undefined;
    }
  | { type: 'setConfig'; payload: Config }
  | { type: 'setBlockHieght'; payload: number }
  | { type: 'setWalletBalance'; payload: number };

export const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'setWalletAddress':
      return {
        ...state,
        walletAddress: action.payload,
      };
    case 'setWallet':
      return {
        ...state,
        wallet: action.payload,
      };
    case 'setConfig':
      return {
        ...state,
        config: action.payload,
      };
    case 'setBlockHieght':
      return {
        ...state,
        blockHeight: action.payload,
      };
    case 'setWalletBalance':
      return {
        ...state,
        walletBalance: action.payload,
      };
  }
};
