import { useEffect } from 'react';
import { useGlobalState } from '../../state/GlobalState';
import eventEmitter from '../../utils/events';
import { Config } from '../../types';


function useConfig () {
  const [{config}, dispatchGlobalState] = useGlobalState();

  useEffect(() => {
  try {
      const storedConfig = localStorage.getItem('config');
      if (storedConfig) {
        dispatchGlobalState({
          type: 'setConfig',
          payload: JSON.parse(storedConfig),
        })
      }
  } catch (error) {
    eventEmitter.emit('error', error);
  }
  }, []);


  function setConfig(props: Partial<Config>){

   try {
    dispatchGlobalState({
        type: 'setConfig',
        payload: {
            ...config,
            ...props
        }
    })
    localStorage.setItem('config', JSON.stringify({...config, ...props}));
   } catch (error) {
    eventEmitter.emit('error', error);
   }

  }

  return [config, setConfig as (props: Partial<Config>) => void] as const;
};

export default useConfig;
