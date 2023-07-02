import {Button, Table} from 'antd'
import './styles.css'
import '../../../index.css'
import { useState } from 'react';


function Home() {

  const [data, setData] = useState<any>([])
  //const [columns, setColumns] = useState<any>([])
  const [view, setView] = useState<string>()


  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  const columns = [
    {
      title: 'FUNCTION',
      dataIndex: 'function',
      key: 'function',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text:any) => <a>{text}</a>,
    },
    {
      title: 'CREATOR',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: 'VALID',
      dataIndex: 'valid',
      key: 'valid',
    },

    {
      title: 'INPUT',
      dataIndex: 'input',
      key: 'input',
    },
    {
      title: 'AGE',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'BLOCK',
      dataIndex: 'block',
      key: 'block',
    },
  ];



  return (
    <div className="page" style={{
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: '20px',
    }}>
       <h2>Analytics</h2>
      <br />
     <div className='flex-row flex-between' style={{
      width: '100%',
      gap:"20px"
     }}>
     
      <div className='flex-row flex-center' style={{
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        border:"2px solid purple"

      }}>
        <h3>Contract interactions over time
          <br />
          Line chart
          <br />
          controls to filter by function type
        </h3>
      </div>
      <div className='flex-row flex-center' style={{
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        border:"2px solid purple"

      }}>
        <h3>Contract interactions by app (eg arns portal, sushiswap, etc)
          <br />
          Bar chart
        </h3>
      </div>
      <div className='flex-row flex-center' style={{
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        border:"2px solid purple"

      }}>
        <h3>
          Percentage of interactions by function
          <br />
          Pie chart
          </h3>
      </div>
        
        
     </div>


     <div className='flex-row flex-start green-pattern' style={{
      width: '100%',
      backgroundColor:'black',
      marginTop:"50px",
      padding:"15px",
      gap:"20px",
      boxSizing:"border-box"
     }}>
      <Button type="primary" style={{
        width: 'fit-content',
        height: '50px',
        backgroundColor: 'rgb(0,0,0,0.5)',
        flex:1
      }}>
        Interactions 
    </Button>

    <Button type="primary" style={{
        width: 'fit-content',
        height: '50px',
        backgroundColor: 'grey',
        flex:1
      }}>
       Holders
    </Button>

    <Button type="primary" style={{
        width: 'fit-content',
        height: '50px',
        backgroundColor: 'grey',
        flex:1
      }}>
        Read 
    </Button>

    <Button type="primary" style={{
        width: 'fit-content',
        height: '50px',
        backgroundColor: 'grey',
        flex:1
      }}>
        Write 
    </Button>

    <Button type="primary" style={{
        width: 'fit-content',
        height: '50px',
        backgroundColor: 'grey',
        flex:1
      }}>
        Source Code 
    </Button>
    <Button type="primary" style={{
        width: 'fit-content',
        height: '50px',
        backgroundColor: 'grey',
        flex:1
      }}>
        Analytics
    </Button>
    <Button type="primary" style={{
        width: 'fit-content',
        height: '50px',
        backgroundColor: 'grey',
        flex:1
      }}>
       Comments
    </Button>

     </div>
      <div className='table-wrapper' style={{margin:0}}>
            <Table dataSource={dataSource} columns={columns} rowClassName={'contract-table-row'}/>
      </div>

    </div>
  );
}
export default Home;
