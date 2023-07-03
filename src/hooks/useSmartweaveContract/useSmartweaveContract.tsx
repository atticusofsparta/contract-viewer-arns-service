import { useEffect, useState } from 'react';

import { ArweaveTransactionID, ContractInteraction } from '../../types';
import { useArweaveCompositeProvider } from '../useArweaveCompositeDataProvider/useArweaveCompositeDataProvider';

function useSmartweaveContract(contractId: string) {
  const arweaveDataProvider = useArweaveCompositeProvider();

  const [state, setState] = useState<{ [x: string]: any }>();
  const [interactions, setInteractions] = useState<ContractInteraction[]>();
  const [evaluationOptions, setEvaluationOptions] = useState<{
    [x: string]: any;
  }>(); // warp eval options
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    try {
      setLoading(true);

      if (!contractId) {
        throw new Error(`contractId is required`);
      }

      arweaveDataProvider
        .getContractState(new ArweaveTransactionID(contractId))
        .then((contractState) => {
          setState(contractState);
        })
        .catch((error) => {
          setErrors([...errors, error]);
        });
      arweaveDataProvider
        .getContractInteractions(new ArweaveTransactionID(contractId))
        .then((contractInteractions) => {
          setInteractions(contractInteractions);
        })
        .catch((error) => {
          setErrors([...errors, error]);
        });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [contractId]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return { state, interactions, loading, errors };
}

export default useSmartweaveContract;
