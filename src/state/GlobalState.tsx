import React, { Dispatch, createContext, useContext, useReducer } from 'react';

import { DEFAULT_CONFIG } from '../constants';
import { ArweaveWalletConnector, Config } from '../types';
import type { Action } from './GlobalReducer';

export type GlobalState = {
  blockHeight: number;
  walletAddress?: string;
  wallet?: ArweaveWalletConnector;
  walletBalance: number;
  config: Config;
};

const initialState: GlobalState = {
  blockHeight: 0,
  walletAddress: undefined,
  walletBalance: 0,
  config: DEFAULT_CONFIG,
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
