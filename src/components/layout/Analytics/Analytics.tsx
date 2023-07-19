import { ArweaveTransactionID } from '../../../types';
import InteractionsByFunction from '../charts/InteractionsByFunction';
import InteractionsOverTime from '../charts/InteractionsOverTime';

function Analytics({ id }: { id: ArweaveTransactionID }) {
  return (
    <>
      <InteractionsOverTime id={id} />
      <InteractionsByFunction id={id} />
    </>
  );
}

export default Analytics;
