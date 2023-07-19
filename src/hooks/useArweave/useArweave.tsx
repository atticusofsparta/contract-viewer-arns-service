import Arweave from 'arweave';
import { useEffect, useState } from 'react';

import { useGlobalState } from '../../state/GlobalState';

function useArweave() {
  const [
    {
      blockHeight,
      config: { gateway },
      wallet,
      walletAddress,
    },
    dispatchGlobalState,
  ] = useGlobalState();

  const [arweave, setArweave] = useState<Arweave | null>(null);

  useEffect(() => {
    const arweaveInstance = Arweave.init({
      host: gateway ?? 'arweave.net',
      port: 443,
      protocol: 'https',
    });

    setArweave(arweaveInstance);
  }, [gateway]);

  // update block height every 2 minutes

  useEffect(() => {
    const interval = setInterval(async () => {
      const height = await arweave?.network
        .getInfo()
        .then((info) => info.height);
      if (height) {
        dispatchGlobalState({ type: 'setBlockHieght', payload: height });
      }
    }, 120000);
    return () => clearInterval(interval);
  }, [arweave, wallet, gateway]);

  return { arweave };
}

export default useArweave;
