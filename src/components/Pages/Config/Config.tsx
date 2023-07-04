import useConfig from "../../../hooks/useConfig/useConfig";
import {useState} from "react";
import { Button} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { set } from "lodash";
import { ARNS_SERVICE_URL, DEFAULT_GATEWAY } from "../../../constants";




function Config() {
  const [{
    gateway, 
    serviceUrl, 
    arnsRegistryContractId, 
    arnsRegistrySrcCodeId,
    nameTokenSrcCodeIds,
    blockHeightRefreshRate,
    walletBalanceRefreshRate
  }, setConfig] = useConfig();

  const [newGateway, setNewGateway] = useState<string>('');
  const [newServiceUrl, setNewServiceUrl] = useState<string>('');
  const [newArnsRegistryContractId, setNewArnsRegistryContractId] = useState<string>('');
  const [newArnsRegistrySrcCodeId, setNewArnsRegistrySrcCodeId] = useState<string | undefined>(undefined);
  const [newNameTokenSrcCodeIds, setNewNameTokenSrcCodeIds] = useState<string[] | undefined>(undefined);
  const [newBlockHeightRefreshRate, setNewBlockHeightRefreshRate] = useState<number>(0);
  const [newWalletBalanceRefreshRate, setNewWalletBalanceRefreshRate] = useState<number>(0);

  const [view, setView] = useState<string>('network');

  const views = ["network", "display", "arprofile", "contracts", "cache"]

  return (
    <div className="page" style={{position:"relative", paddingLeft:"230px"}}>
      <div 
      className="flex-column flex-center green-pattern" 
      style={{
        justifyContent:"flex-start",
        height:'100%', 
        width:"200px", 
        backgroundColor:"rgb(0,0,0)", 
        position:"absolute", 
        top:0, 
        left: 0, 
        padding:"100px 15px",
        boxSizing:"border-box",
        gap:"20px"
      }}
        >

          {views.map((v) =>    <Button onClick={()=> setView(v)} style={{
          backgroundColor: v === view ? "rgb(0,0,0,0.5)" : "grey",
          color:"white",
          width:"100%"
        }}>
        {v.toLocaleUpperCase()}
        </Button> )}
    
      </div>

      {view === 'network' ? 
      <div className="flex-column flex-start fill-space" style={{gap:100}}>
        <div className="flex-row flex-between" style={{width:"100%"}}>
        <h2>Network:</h2>
        <div className="flex-column" style={{gap:"10px"}}>
          <a href={`http://${gateway}`} rel="noreferer" target="_blank">Gateway:&nbsp;{gateway} <ArrowRightOutlined size={30}/></a>
          <a href={`http://${serviceUrl}`} rel="noreferer" target="_blank">ArNS Service:&nbsp;{serviceUrl} <ArrowRightOutlined size={30}/></a>
        </div>
          </div>

          <div className="flex-column flex-start" style={{width:"100%", gap:"5px"}}>
          <span style={{width:"400px", justifyContent:'space-between', display:"flex"}}>New gateway: 
          <input 
          type='text' 
          value={newGateway}
          onChange={(e)=> setNewGateway(e.target.value)}
          placeholder={gateway}
          />
          </span>
          <span style={{width:"400px", justifyContent:'space-between', display:"flex"}}>New ArNS service url: 
          <input 
          type='text' 
          value={newServiceUrl}
          onChange={(e)=> setNewServiceUrl(e.target.value)}
          placeholder={serviceUrl}
          />
          </span>
         
            </div>
            <div className="flex-row flex-start" style={{gap:30}}>
            <Button style={{background:"gold"}}
            onClick={()=> {
              setConfig({
                gateway: newGateway.length ? newGateway : gateway,
                serviceUrl: newServiceUrl?.length ? newServiceUrl : serviceUrl,
              });
              setNewGateway('');
              setNewServiceUrl('');
            }}
            >
            Save
          </Button>
          <Button onClick={()=> setConfig({gateway: DEFAULT_GATEWAY, serviceUrl:ARNS_SERVICE_URL})} style={{background:"silver"}}>
            Reset to defaults
          </Button>
          <Button onClick={()=> setConfig({gateway: 'localhost:1984', serviceUrl:'localhost:3000'})} style={{background:"silver"}}>
            Use local servers
          </Button>

              </div>
        
      </div>
      : <></>}
      {view === 'display' ? <h3>display</h3> : <></>}
      {view === 'arprofile' ? <h3>arprofile</h3> : <></>}
      {view === 'contracts' ? <h3>contracts</h3> : <></>}
      {view === 'cache' ? <h3>cache</h3> : <></>}

    </div>
  );
}

export default Config;
