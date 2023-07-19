import { Spin } from 'antd';
import { set } from 'lodash';
import { useEffect, useState } from 'react';

import { useArweaveCompositeProvider } from '../../../hooks/useArweaveCompositeDataProvider/useArweaveCompositeDataProvider';
import { useGlobalState } from '../../../state/GlobalState';
import { ArweaveTransactionID } from '../../../types';
import eventEmitter from '../../../utils/events';

function Write() {
  const [{ walletAddress, config }, dispatchGlobalState] = useGlobalState();
  const arweaveDataProvider = useArweaveCompositeProvider();
  const [recipient, setRecipient] = useState<string>();
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (walletAddress) {
      arweaveDataProvider
        .getContractState(
          new ArweaveTransactionID(config.arnsRegistryContractId),
        )
        .then((state) => {
          setBalance(state.balances[walletAddress]);
        });
    }
  }, [walletAddress]);

  async function sendTokens() {
    try {
      eventEmitter.emit('warning', {
        name: `Transfer`,
        message: `Transfering ${amount} IO tokens to ${recipient}`,
      });
      setLoading(true);
      if (!walletAddress) {
        throw new Error(
          'No wallet address - connect before trying to send tokens',
        );
      }
      const result = await arweaveDataProvider.writeTransaction({
        dryWrite: true,
        walletAddress: new ArweaveTransactionID(walletAddress),
        contractTxId: new ArweaveTransactionID(config.arnsRegistryContractId),
        payload: {
          function: 'transfer',
          target: recipient,
          qty: amount,
        },
      });
      if (result) {
        eventEmitter.emit('info', {
          name: `Success`,
          message: `Transfered ${amount} IO tokens to ${recipient}: Transaction ID: ${result.toString()}`,
        });
      }
      setBalance(balance - amount);
      setAmount(0);
      setRecipient('');
    } catch (error) {
      eventEmitter.emit('error', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-column center" style={{ width: '100%', gap: '20px' }}>
      <div
        className="flex-column center"
        style={{
          width: '400px',
          height: '400px',
          border: '2px solid black',
          borderRadius: '5px',
          padding: '15px',
          backgroundColor: 'rgb(0,0,100,0.5)',
          gap: '20px',
          margin: 'auto',
        }}
      >
        <h3>Tansfer IO</h3>
        <input
          type="text"
          placeholder="Recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          maxLength={43}
          disabled={loading}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
          disabled={loading}
          max={balance}
        />
        <span
          className="flex-row space-between"
          style={{ width: '100%', justifyContent: 'space-between' }}
        >
          Balance: {balance} IO{' '}
          <button
            onClick={() => setAmount(balance)}
            style={{ background: 'orange' }}
          >
            use max
          </button>
        </span>
        {!loading ? (
          <>
            <button
              style={{
                width: '100%',
                height: '50px',
                border: '2px solid black',
                borderRadius: '5px',
                padding: '15px',
                backgroundColor: !recipient || !amount ? 'grey' : 'purple',
                cursor: 'pointer',
              }}
              disabled={!recipient || !amount}
              onClick={() => sendTokens()}
            >
              Send
            </button>
          </>
        ) : (
          <Spin size={'large'} />
        )}
      </div>
    </div>
  );
}

export default Write;
