import { Table } from 'antd';

import useInteractionsTable from '../../../hooks/useInteractionsTable/useInteractionsTable';
import useSmartweaveContract from '../../../hooks/useSmartweaveContract/useSmartweaveContract';
import { ArweaveTransactionID } from '../../../types';

function InteractionsTable({ id }: { id: ArweaveTransactionID }) {
  if (!id) {
    return <h3>no id provided to table</h3>;
  }

  const { interactions } = useSmartweaveContract(id.toString());
  const { columns, rows } = useInteractionsTable(interactions);

  return (
    <div className="flex-column">
      <div
        className="table-wrapper green-pattern"
        style={{ margin: 0, height: 'fit-content' }}
      >
        <Table
          dataSource={rows}
          columns={columns}
          rowClassName={'contract-table-row'}
          pagination={{
            defaultPageSize: 50,
          }}
        />
      </div>
    </div>
  );
}

export default InteractionsTable;
