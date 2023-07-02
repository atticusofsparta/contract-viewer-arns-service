import React, { Dispatch, createContext, useContext, useReducer } from 'react';

import { ArweaveWalletConnector } from '../types';
import type { Action } from './GlobalReducer';

export type GlobalState = {
  gateway: string;
  blockHeight: number;
  walletAddress: string;
  wallet?: ArweaveWalletConnector | undefined;
  walletBalance: number;
};

const initialState: GlobalState = {
  gateway: 'https://arweave.net',
  blockHeight: 0,
  walletAddress: '',
  walletBalance: 0,
};

const GlobalStateContext = createContext<[GlobalState, Dispatch<Action>]>([
  initialState,
  () => initialState,
]);

export const useGlobalState = (): [GlobalState, Dispatch<Action>] =>
  useContext(GlobalStateContext);

type StateProviderProps = {
  reducer: React.Reducer<GlobalState, Action>;
  children: React.ReactNode;
};

/** Create provider to wrap app in */
export default function GlobalStateProvider({
  reducer,
  children,
}: StateProviderProps): JSX.Element {
  const [state, dispatchGlobalState] = useReducer(reducer, initialState);
  return (
    <GlobalStateContext.Provider value={[state, dispatchGlobalState]}>
      {children}
    </GlobalStateContext.Provider>
  );
}
