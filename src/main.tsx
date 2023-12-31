import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';
import { reducer } from './state/GlobalReducer';
import GlobalStateProvider from './state/GlobalState';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStateProvider reducer={reducer}>
      <App />
    </GlobalStateProvider>
  </React.StrictMode>,
);
