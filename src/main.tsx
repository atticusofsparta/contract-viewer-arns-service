import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import GlobalStateProvider from './state/GlobalState.tsx'
import { reducer } from './state/GlobalReducer.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStateProvider reducer={reducer}>
    <App />
    </GlobalStateProvider>
 
  </React.StrictMode>,
)
