import { ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { set } from 'lodash';
import { useState } from 'react';

import {
  ARNS_SERVICE_URL,
  DEFAULT_ARNS_CONTRACT_IDS,
  DEFAULT_GATEWAY,
  PDNS_REGISTRY_ADDRESS,
  TX_ID_REGEX,
} from '../../../constants';
import useConfig from '../../../hooks/useConfig/useConfig';
import CopyTextButton from '../../buttons/CopyTextButton/CopyTextButton';
import eventEmitter from '../../../utils/events';

function Config() {
  const [
    {
      gateway,
      serviceUrl,
      arnsRegistryContractId,
      savedArnsContractIds,
      arnsRegistrySrcCodeId,
      nameTokenSrcCodeIds,
      blockHeightRefreshRate,
      walletBalanceRefreshRate,
    },
    setConfig,
  ] = useConfig();

  const [newGateway, setNewGateway] = useState<string>('');
  const [newServiceUrl, setNewServiceUrl] = useState<string>('');
  const [newArnsRegistryContractId, setNewArnsRegistryContractId] =
    useState<string>('');
  const [newArnsRegistrySrcCodeId, setNewArnsRegistrySrcCodeId] = useState<
    string | undefined
  >(undefined);
  const [newNameTokenSrcCodeIds, setNewNameTokenSrcCodeIds] = useState<
    string[] | undefined
  >(undefined);
  const [newBlockHeightRefreshRate, setNewBlockHeightRefreshRate] =
    useState<number>(0);
  const [newWalletBalanceRefreshRate, setNewWalletBalanceRefreshRate] =
    useState<number>(0);

  const [view, setView] = useState<string>('network');

  const views = ['network', 'display', 'arprofile', 'contracts', 'cache'];

  return (
    <div
      className="page"
      style={{ position: 'relative', paddingLeft: '230px' }}
    >
      <div
        className="flex-column flex-center green-pattern"
        style={{
          justifyContent: 'flex-start',
          height: '100%',
          width: '200px',
          backgroundColor: 'rgb(0,0,0)',
          position: 'absolute',
          top: 0,
          left: 0,
          padding: '100px 15px',
          boxSizing: 'border-box',
          gap: '20px',
        }}
      >
        {views.map((v) => (
          <Button
            onClick={() => setView(v)}
            style={{
              backgroundColor: v === view ? 'rgb(0,0,0,0.5)' : 'grey',
              color: 'white',
              width: '100%',
            }}
          >
            {v.toLocaleUpperCase()}
          </Button>
        ))}
      </div>

      {view === 'network' ? (
        <div className="flex-column flex-start fill-space" style={{ gap: 100 }}>
          <div className="flex-row flex-between" style={{ width: '100%' }}>
            <h2>Network:</h2>
            <div className="flex-column" style={{ gap: '10px' }}>
              <a href={`http://${gateway}`} rel="noreferer" target="_blank">
                Gateway:&nbsp;{gateway} <ArrowRightOutlined size={30} />
              </a>
              <a href={`http://${serviceUrl}`} rel="noreferer" target="_blank">
                ArNS Service:&nbsp;{serviceUrl} <ArrowRightOutlined size={30} />
              </a>
            </div>
          </div>

          <div
            className="flex-column flex-start"
            style={{ width: '100%', gap: '5px' }}
          >
            <span
              style={{
                width: '400px',
                justifyContent: 'space-between',
                display: 'flex',
              }}
            >
              New gateway:
              <input
                type="text"
                value={newGateway}
                onChange={(e) => setNewGateway(e.target.value)}
                placeholder={gateway}
              />
            </span>
            <span
              style={{
                width: '400px',
                justifyContent: 'space-between',
                display: 'flex',
              }}
            >
              New ArNS service url:
              <input
                type="text"
                value={newServiceUrl}
                onChange={(e) => setNewServiceUrl(e.target.value)}
                placeholder={serviceUrl}
              />
            </span>
          </div>
          <div className="flex-row flex-start" style={{ gap: 30 }}>
            <Button
              style={{ background: 'gold' }}
              onClick={() => {
                setConfig({
                  gateway: newGateway.length ? newGateway : gateway,
                  serviceUrl: newServiceUrl?.length
                    ? newServiceUrl
                    : serviceUrl,
                });
                setNewGateway('');
                setNewServiceUrl('');
              }}
            >
              Save
            </Button>
            <Button
              onClick={() =>
                setConfig({
                  gateway: DEFAULT_GATEWAY,
                  serviceUrl: ARNS_SERVICE_URL,
                })
              }
              style={{ background: 'silver' }}
            >
              Reset to defaults
            </Button>
            <Button
              onClick={() =>
                setConfig({
                  gateway: 'localhost:1984',
                  serviceUrl: 'localhost:3000',
                })
              }
              style={{ background: 'silver' }}
            >
              Use local servers
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
      {view === 'display' ? <h3>display</h3> : <></>}
      {view === 'arprofile' ? <h3>arprofile</h3> : <></>}
      {view === 'contracts' ? (
        <div className="flex-column flex-start fill-space" style={{ gap: 100 }}>
          <div className="flex-row flex-between" style={{ width: '100%' }}>
            <h2>Contract Settings:</h2>
            <div className="flex-column" style={{ gap: '10px' }}>
              <span className="flex-row">
                Registry ID:&nbsp;
                <CopyTextButton
                  position="relative"
                  size={0}
                  copyText={arnsRegistryContractId}
                  displayText={arnsRegistryContractId}
                />
              </span>
              <span className="flex-row">
                Source Code ID:&nbsp;
                <CopyTextButton
                  size={0}
                  position="relative"
                  copyText={arnsRegistrySrcCodeId ?? 'unset'}
                  displayText={arnsRegistrySrcCodeId ?? 'unset'}
                />
              </span>
            </div>
          </div>

          <div
            className="flex-column flex-start"
            style={{ width: '100%', gap: '15px' }}
          >
            <span
              style={{
                width: 'fit-content',
                justifyContent: 'space-between',
                display: 'flex',
                gap:"10px"
              }}
            >
              New ArNS registry ID:
              <input
                type="search"
                value={newArnsRegistryContractId}
                onChange={(e) => setNewArnsRegistryContractId(e.target.value)}
                placeholder={arnsRegistryContractId}
                style={{
                  width: '400px',
                  boxShadow: newArnsRegistryContractId
                    ? TX_ID_REGEX.test(newArnsRegistryContractId ?? '')
                      ? '0px 0px 5px 3px green'
                      : '0px 0px 5px 3px red'
                    : '',
                }}
                pattern={TX_ID_REGEX.source}
                maxLength={43}
              />
              <Button
                style={{ background: 'green' }}
                onClick={() => {
                  if (!TX_ID_REGEX.test(newArnsRegistryContractId)) {
                   return eventEmitter.emit('error', new Error("Invalid contract id, must be 43 characters long and only contain letters, numbers, and '_'"));
                  }
                  setConfig({
                    arnsRegistryContractId: newArnsRegistryContractId,
                    savedArnsContractIds: savedArnsContractIds
                      ? [...savedArnsContractIds, newArnsRegistryContractId]
                      : [newArnsRegistryContractId],
                  });
                  setNewArnsRegistryContractId('');
                }}
              >
                Add to defaults
              </Button>
            </span>
            <span
              style={{
                width: 'fit-content',
                justifyContent: 'space-between',
                display: 'flex',
                gap:"10px"
              }}
            >
              New ArNS Source Code ID:
              <input
                type="search"
                value={newArnsRegistrySrcCodeId}
                onChange={(e) => setNewArnsRegistrySrcCodeId(e.target.value)}
                placeholder={arnsRegistrySrcCodeId}
                style={{
                  width: '400px',
                  boxShadow: newArnsRegistrySrcCodeId
                    ? TX_ID_REGEX.test(newArnsRegistrySrcCodeId ?? '')
                      ? '0px 0px 5px 3px green'
                      : '0px 0px 5px 3px red'
                    : '',
                }}
                pattern={TX_ID_REGEX.source}
                maxLength={43}
              />
            </span>
          </div>
          <div className="flex-row flex-start" style={{ gap: 30 }}>
            <Button
              style={{ background: 'gold' }}
              onClick={() => {
                setConfig({
                  arnsRegistryContractId: newArnsRegistryContractId.length
                    ? newArnsRegistryContractId
                    : arnsRegistryContractId,
                  arnsRegistrySrcCodeId: newArnsRegistrySrcCodeId?.length
                    ? newArnsRegistrySrcCodeId
                    : arnsRegistrySrcCodeId,
                });
                setNewArnsRegistryContractId('');
                setNewArnsRegistrySrcCodeId('');
              }}
            >
              Save
            </Button>
            <Button
              onClick={() =>
                setConfig({
                  arnsRegistryContractId: PDNS_REGISTRY_ADDRESS,
                  arnsRegistrySrcCodeId: undefined,
                })
              }
              style={{ background: 'silver' }}
            >
              Reset to defaults
            </Button>
            <div className="flex-column flex-start" style={{ gap: 10 }}>
            <label>Default ArNS contract ids</label>
            <div className='flex-row' style={{gap:"20px"}}> 
            <select style={{height:"30px"}}
            value={arnsRegistryContractId}
              onChange={(v) =>
                setConfig({ arnsRegistryContractId: v.target.value })
              }
            >
              {[
                ...DEFAULT_ARNS_CONTRACT_IDS,
                ...(savedArnsContractIds
                  ? savedArnsContractIds.filter(
                      (id) => !DEFAULT_ARNS_CONTRACT_IDS.includes(id),
                    )
                  : []),
              ].map((id) => (
                <option value={id}>
                  {id}&nbsp;
                </option>
              ))}
            </select>
         {!DEFAULT_ARNS_CONTRACT_IDS.includes(arnsRegistryContractId) ?  <Button
                    style={{ background: "crimson", color: "white" }}
                    onClick={() =>
                      setConfig({
                        arnsRegistryContractId: DEFAULT_ARNS_CONTRACT_IDS[0],
                        savedArnsContractIds:savedArnsContractIds ? savedArnsContractIds?.filter(
                          (contractID) => arnsRegistryContractId !== contractID,
                        ) : [],
                      })
                    }
                  >
                   <b> Remove custom id from defaults</b>
                  </Button> : <></>}
                  </div>
              </div>
          


           
          </div>
        </div>
      ) : (
        <></>
      )}
      {view === 'cache' ? <h3>cache</h3> : <></>}
    </div>
  );
}

export default Config;
