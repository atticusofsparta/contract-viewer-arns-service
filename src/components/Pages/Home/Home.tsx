import { useState } from 'react';

import '../../../index.css';
import { useGlobalState } from '../../../state/GlobalState';
import { ArweaveTransactionID } from '../../../types';
import Analytics from '../../layout/Analytics/Analytics';
import ContractState from '../../layout/ContractState/ContractState';
import ContractViewSelector, {
  ContractView,
} from '../../layout/ContractViewSelector/ContractViewSelector';
import TransactionInfo from '../../layout/TransactionInfo/TransactionInfo';
import Write from '../../layout/Write/Write';
import InteractionsTable from '../../layout/tables/InteractionsTable';
import './styles.css';

function Home() {
  const [view, setView] = useState<ContractView>('interactions');
  const [
    {
      config: { arnsRegistryContractId },
    },
    dispatchGlobalState,
  ] = useGlobalState();

  return (
    <div
      className="page"
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '20px',
      }}
    >
      <TransactionInfo id={new ArweaveTransactionID(arnsRegistryContractId)} />

      <ContractViewSelector
        viewCallback={(v: ContractView) => setView(v)}
        view={view}
      />

      {view === 'interactions' ? (
        <InteractionsTable
          id={new ArweaveTransactionID(arnsRegistryContractId)}
        />
      ) : (
        <></>
      )}
      {view === 'read' ? (
        <ContractState
          contractId={new ArweaveTransactionID(arnsRegistryContractId)}
        />
      ) : (
        <></>
      )}
      {view === 'write' ? <Write /> : <></>}
      {view === 'analytics' ? (
        <Analytics id={new ArweaveTransactionID(arnsRegistryContractId)} />
      ) : (
        <></>
      )}
    </div>
  );
}
export default Home;
