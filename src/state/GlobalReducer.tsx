import { ArweaveWalletConnector } from "../types";
import { GlobalState } from "./GlobalState";

export type Action =
  | { type: 'setWalletAddress'; payload: string }
  | {
      type: 'setWallet';
      payload: ArweaveWalletConnector | undefined;
    }
  | { type: 'setGateway'; payload: string }
  | { type: 'setBlockHieght'; payload: number }


  export const reducer = (state: GlobalState, action: Action): GlobalState => {

    switch (action.type){
        case 'setWalletAddress':
            return {
                ...state,
                walletAddress: action.payload
            };
        case 'setWallet':
            return {
                ...state,
                wallet: action.payload
            };
        case 'setGateway':
            return {
                ...state,
                gateway: action.payload
            };
        case 'setBlockHieght':
            return {
                ...state,
                blockHeight: action.payload
            };

    }
  }