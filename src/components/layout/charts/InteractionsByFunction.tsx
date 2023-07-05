import {useState, useEffect, useRef} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    ArcElement,
    Title,
    PieController,
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
    ArcElement,
    PieController,
    Title,
    Tooltip,
    Legend
  );


function InteractionsByFunction ({id}:{id:ArweaveTransactionID}) {

    const {interactions} = useSmartweaveContract(id.toString())

    const [data, setData] = useState<{height:number, interactions: number}[]>()
    const [functionData, setFunctionData] = useState<{[x:string]:number}>({})
    const chartRef = useRef<ChartJSOrUndefined>(null)

    useEffect(()=> {

        if(!interactions){
            return
        }

        generateData(interactions)
    } ,[interactions])


    function generateData(interactions:ContractInteraction[]) {
        // sort interactions by blockHeight in ascending order
        const sortedInteractions = [...interactions].sort((a, b) => a.height - b.height);
      
        let cumulativeCount = 0;
        const cumulativeInteractions = [];
        const functionCounts:{[x:string]:number} = {};
      
        for (const interaction of sortedInteractions) {
          cumulativeCount += 1;
      
          // Track function counts
          const functionType = interaction.input?.function;
          if (!functionCounts[functionType]) {
            functionCounts[functionType] = 0;
          }
          functionCounts[functionType]++;
      
          // If the last interaction's height is the same, continue to next iteration
          if (
            cumulativeInteractions.length > 0 &&
            cumulativeInteractions[cumulativeInteractions.length - 1].height === interaction.height
          ) {
            continue;
          }
      
          cumulativeInteractions.push({
            height: interaction.height,
            interactions: cumulativeCount
          });
        }
      
        // Assuming setData and setFunctionData are useState setters
        setData(cumulativeInteractions);
        setFunctionData(functionCounts);
        console.log({
          sortedInteractions,
          cumulativeInteractions,
          functionCounts,
          originalLength: interactions.length
        });
      }
      
      

    if (!data || !interactions) {
        return <Spin size={"large"} />
    }
    const functionTypes = Object.keys(functionData);
    const interactionCounts = Object.values(functionData);
    
    const chartData = {
      labels: functionTypes,
      datasets: [
        {
          label: 'Contract Interactions by Function Type',
          data: interactionCounts,
          backgroundColor: functionTypes.map(
            (_, i) => `hsla(${(i / functionTypes.length) * 360}, 50%, 25%, 1)`
          ),
          
        },
      ],
    };
    


  return (
    
     <Chart 
     type="pie" 
     ref={chartRef} 
     data={chartData} 
     options={{
     
        plugins: {
          title: {
            display: true,
            text: 'Interactions by function type',
          },
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
                    return `Function Name: ${ctx[0].label}`
                }, 
                label: (ctx) =>{
                    return `Interaction Percentage: ${(functionData[ctx.label] / interactions.length * 100).toPrecision(5)}%`
                }, 
                }
            }
        }
     }}  
     />

  );
};

export default InteractionsByFunction;
