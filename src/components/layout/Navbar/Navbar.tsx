import { ExperimentFilled, SettingFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { Searchbar } from '..';
import { useGlobalState } from '../../../state/GlobalState';
import { ArConnectWalletConnector } from '../../../utils/ArConnectWalletConnector';
import eventEmitter from '../../../utils/events';
import './styles.css';

function Navbar() {
  const [
    { walletAddress, wallet, blockHeight, walletBalance },
    dispatchGlobalState,
  ] = useGlobalState();

  return (
    <div
      className="navbar green-pattern"
      style={{
        padding: '0 30px',
        zIndex: '1000',
        position: 'fixed',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'black',
      }}
    >
      <Link to="/">
        <div
          style={{
            gap: '30px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ExperimentFilled size={50} />
          <span>ArNS service interface</span>
        </div>
      </Link>

      <Searchbar />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        <Link to="/docs">docs</Link>
        <Link
          to="/config"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'red',
          }}
        >
          <SettingFilled size={50} />
          CONFIG
        </Link>
        {walletAddress ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
            }}
          >
            <span>Block Height: {blockHeight}</span> |
            <span>AR: {walletBalance.toPrecision(6)}</span>
          </div>
        ) : (
          <></>
        )}
        <button
          style={{
            fontSize: '13px',
          }}
          onClick={() => {
            if (!walletAddress) {
              const newWallet = new ArConnectWalletConnector();
              newWallet.connect();
              dispatchGlobalState({ type: 'setWallet', payload: wallet });
              newWallet
                .getWalletAddress()
                .then((address) => {
                  dispatchGlobalState({
                    type: 'setWalletAddress',
                    payload: address.toString(),
                  });
                })
                .catch((err) => {
                  eventEmitter.emit('error', { message: err, name: 'Error' });
                });
            } else {
              wallet?.disconnect();
              dispatchGlobalState({ type: 'setWallet', payload: undefined });
              dispatchGlobalState({ type: 'setWalletAddress', payload: '' });
            }
          }}
        >
          {walletAddress
            ? `Disconnect: ${walletAddress.substring(
                0,
                4,
              )}...${walletAddress.substring(walletAddress.length - 4)}`
            : 'Connect'}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
