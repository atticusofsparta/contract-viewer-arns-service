import { useState } from 'react';

import { PDNS_REGISTRY_ADDRESS } from '../../../constants';
import '../../../index.css';
import { ArweaveTransactionID } from '../../../types';
import ContractState from '../../layout/ContractState/ContractState';
import ContractViewSelector, {
  ContractView,
} from '../../layout/ContractViewSelector/ContractViewSelector';
import InteractionsTable from '../../layout/tables/InteractionsTable';
import './styles.css';
import { useGlobalState } from '../../../state/GlobalState';

function Home() {
  const [view, setView] = useState<ContractView>('interactions');
  const [{config:{arnsRegistryContractId}}, dispatchGlobalState] = useGlobalState();

  return (
    <div
      className="page"
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '20px',
      }}
    >
      <h2>Analytics</h2>
      <br />
      <div
        className="flex-row flex-between"
        style={{
          width: '100%',
          gap: '20px',
        }}
      >
        <div
          className="flex-row flex-center"
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            border: '2px solid purple',
          }}
        >
          <h3>
            Contract interactions over time
            <br />
            Line chart
            <br />
            controls to filter by function type
          </h3>
        </div>
        <div
          className="flex-row flex-center"
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            border: '2px solid purple',
          }}
        >
          <h3>
            Contract interactions by app (eg arns portal, sushiswap, etc)
            <br />
            Bar chart
          </h3>
        </div>
        <div
          className="flex-row flex-center"
          style={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            border: '2px solid purple',
          }}
        >
          <h3>
            Percentage of interactions by function
            <br />
            Pie chart
          </h3>
        </div>
      </div>
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
    </div>
  );
}
export default Home;
