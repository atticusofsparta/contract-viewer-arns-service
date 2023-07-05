import {useState, useEffect, useRef} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { ArweaveTransactionID } from '../../../types';
import { Spin } from 'antd';
import useSmartweaveContract from '../../../hooks/useSmartweaveContract/useSmartweaveContract';
import { ContractInteraction } from '../../../types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );


function InteractionsOverTime ({id}:{id:ArweaveTransactionID}) {

    const {interactions} = useSmartweaveContract(id.toString())

    const [data, setData] = useState<{height:number, interactions: number}[]>()
    const chartRef = useRef<ChartJSOrUndefined>(null)

    useEffect(()=> {

        if(!interactions){
            return
        }

        generateData(interactions)
    } ,[interactions])


   function generateData (interactions: ContractInteraction[]) {
        // sort interactions by blockHeight in ascending order
        const sortedInteractions = [...interactions].sort((a, b) => a.height - b.height);
      
        let cumulativeCount = 0;
        const cumulativeInteractions: {height: number, interactions:number}[] = [];
      
       for (const interaction of sortedInteractions) {
          cumulativeCount += 1;
          if (cumulativeInteractions.length > 0 && cumulativeInteractions[cumulativeInteractions.length - 1].height === interaction.height) {
            continue
          }
          cumulativeInteractions.push({height: interaction.height, interactions: cumulativeCount});
        }
      
        setData(cumulativeInteractions);
        console.log({sortedInteractions, cumulativeInteractions, originalLength: interactions.length})
      };
      

    if (!data) {
        return <Spin size={"large"} />
    }
  const chartData = {
    labels: data.map(item => item.height), // Assuming 'data' is an array of objects with 'blockHeight' and 'interactions' properties
    datasets: [
      {
        label: 'Contract Interactions Over Time',
        data: data.map(item => item.interactions),
        fill: false,
        backgroundColor: 'rgb(0,0,0,.5)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.314,
      },
    ],
  };


  return (
    
     <Chart 
     type="line" 
     ref={chartRef} 
     data={chartData} 
     options={{
        plugins: {
            tooltip:{
                enabled: true,
                mode: 'index',
                intersect: false,
                position: 'nearest',
                backgroundColor: '#38393B',
                titleFont: {
                  size: 12,
                  weight: '400',
                },
                footerFont: {
                  size: 12, // footer font size in px
                  style: 'normal', // footer font style
                  weight: '700', // footer font weight
                },
                titleAlign: 'center',
                footerAlign: 'center',
                footerColor: '#FAFAFA',
                titleColor: '#FAFAFA',
                xAlign: 'center',
                yAlign: 'bottom',
                caretPadding: 15,
                padding: 14,
                callbacks: {
                title: (ctx) =>{
                    return `Block Height: ${ctx[0].label}`
                }, 
                label: (ctx) =>{
                    return `Interactions: ${ctx.parsed.y}`
                }, 
                }
            }
        }
     }}  
     />

  );
};

export default InteractionsOverTime;
