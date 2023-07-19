import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

import { useArweaveCompositeProvider } from '../../../hooks/useArweaveCompositeDataProvider/useArweaveCompositeDataProvider';
import { ArweaveTransactionID } from '../../../types';
import CopyTextButton from '../../buttons/CopyTextButton/CopyTextButton';

function TransactionInfo({ id }: { id: ArweaveTransactionID }) {
  const arweaveDataProvider = useArweaveCompositeProvider();

  const [transactionData, setTransactionData] = useState<any>(null);

  useEffect(() => {
    arweaveDataProvider.getTransactionTags(id).then((data) => {
      setTransactionData(data);
    });
  }, [id]);

  if (!transactionData) {
    return <Spin size={'large'} />;
  }

  return (
    <div className="flex-row" style={{ width: '100%', gap: '20px' }}>
      <div
        className="flex-column green-pattern"
        style={{
          width: '50%',
          border: '2px solid black',
          borderRadius: '5px',
          padding: '15px',
          backgroundColor: 'rgb(0,0,100,0.5)',
          gap: '20px',
        }}
      >
        <span className="flex-row">
          Contract ID:{' '}
          <CopyTextButton
            position="relative"
            copyText={id.toString()}
            displayText={id.toString()}
            size={0}
          />
        </span>
        <span className="flex-row">
          Source Code ID:{' '}
          <CopyTextButton
            position="relative"
            copyText={transactionData['Contract-Src']}
            displayText={transactionData['Contract-Src']}
            size={0}
          />
        </span>
      </div>
      <div
        className="flex-column green-pattern"
        style={{
          width: '50%',
          border: '2px solid black',
          borderRadius: '5px',
          padding: '15px',
          backgroundColor: 'rgb(0,0,100,0.5)',
        }}
      >
        <h2>Tags</h2>
        <ReactJson
          src={{
            ...transactionData,
            'Contract-Manifest': JSON.parse(
              transactionData?.['Contract-Manifest'] ?? '{}',
            ),
          }}
          theme={'ashes'}
          name={id.toString()}
          groupArraysAfterLength={100}
          quotesOnKeys={false}
        />
      </div>
    </div>
  );
}

export default TransactionInfo;
