import ReactJson from 'react-json-view';

import useSmartweaveContract from '../../../hooks/useSmartweaveContract/useSmartweaveContract';
import { ArweaveTransactionID } from '../../../types';
import { Spin } from 'antd';

function ContractState({ contractId }: { contractId: ArweaveTransactionID }) {
  const { state: contractState } = useSmartweaveContract(contractId.toString());

  if (!contractState) {
    return <Spin size={'large'} />;
  }

  return (
    <div className="flex-column" style={{ width: '100%' }}>
      <ReactJson
        src={contractState}
        theme={'ashes'}
        shouldCollapse={(field) =>
          field.name === 'records' ||
          field.name === 'balances' ||
          field.name === 'auctions' ||
          field.name === 'reserved'
            ? true
            : false
        }
        name={contractId.toString()}
        groupArraysAfterLength={100}
        quotesOnKeys={false}
      />
    </div>
  );
}

export default ContractState;
