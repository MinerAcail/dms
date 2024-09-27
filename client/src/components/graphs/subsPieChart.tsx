import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
 
} from 'recharts';
import "./style.scss";
import { Button } from '../ui/button';
import { useAuth } from '@/middleware/context/authContext';




const data = [
  {
    name: 'Week 1',
    Male: 30,
    Female: 240,
   
  
  },
  {
    name: 'Week 2',
    Male: 70,
    Female: 138,
  
  },
  {
    name: 'Week 3',
    Male: 200,
    Female: 380,
  
  },
  {
    name: 'Week 4',
    Male: 278,
    Female: 198,
  }
];


const SubsPieChart = ({toggleVisibility,isHidden}:{toggleVisibility: any,isHidden: boolean}) => {
  const {  user } = useAuth();

  const Admin = user?.types === "Admin";
    const [hiddenLines, setHiddenLines] = useState<{
      Male: boolean;
     
      Female: boolean;
    
    }>({
        Male: false,
        Female: false,
      });
      const [activeLabels, setActiveLabels] = useState([]);

     
      const toggleLineVisibility = (dataKey: keyof DataView) => {
        setHiddenLines(prevHiddenLines => ({
          ...prevHiddenLines,
          [dataKey]: !prevHiddenLines[dataKey],
        }));
       
      };
     
      
  return (
    <>
    {
      Admin && 
      <>
      
     <Button className="toggle-button" onClick={toggleVisibility}>
        {isHidden ? 'Show PicChart' : 'Hide PicChart'}
      </Button>
      </>
    }

    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        
        
        data={data}
        margin={{
          top: 30,
          right: 50,
          left: 20,
          bottom: 20,
          
        }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true}  vertical={false} opacity={0.3}  />
        <XAxis dataKey="name" tick={<CustomizedAxisTick payload={{
            value: ''
          }}  />}  />
        <YAxis  axisLine={false} tickLine={true} tickCount={12} />
      

        <Tooltip  contentStyle={custom} />
        <Legend iconSize={20} iconType='line' onClick={(e) => {
           toggleLineVisibility(e.dataKey)
          
        }
         
          
          } verticalAlign="top" height={36}/>
        <ReferenceLine x="Week 2" stroke="red" label="Low" opacity={0.8}  />
        <ReferenceLine y={300} label="Max" stroke="red" opacity={0.9}  />
        <Line  hide={hiddenLines.Male} type="monotone" dataKey="Male" stroke="#FF9CFB" label={<CustomizedLabel  />} activeDot={{ stroke: 'red', strokeWidth: 2, r: 10 }} strokeWidth={2} strokeDasharray="10" />
        <Line  hide={hiddenLines.Female} type="monotone" dataKey="Female" stroke="#F9F871" label={<CustomizedLabel />} activeDot={{ stroke: 'red', strokeWidth: 2, r: 10 }} strokeWidth={2} strokeDasharray="10" />
      </LineChart>
    </ResponsiveContainer>
    </>
  );
};

const custom = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '19px',
  color: '#f3eeff',
  overflowY: 'auto',
  padding: '20px',
  marginTop: '20px',
  backgroundColor: '#454452',
  borderRadius: '20px',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  WebkitBackdropFilter: 'blur(2px)',
}


interface CustomizedAxisTickProps {
  x?: number ;
  y?: number;
  payload: { value: string };
}
/* interface CustomTooltipProps {
  active?: string ;
  label?: string;
  payload: Array<{ length: string; value: string }>;
} */
interface CustomizedLabelProps {
  x?: number;
  y?: number;
   value?: string ;
}


const CustomizedAxisTick: React.FC<CustomizedAxisTickProps> = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={13} textAnchor="end" fill="white" transform="rotate(-25)">
        {payload.value}
      </text>
    </g>
  );

  const CustomizedLabel : React.FC<CustomizedLabelProps> = ({ x, y,  value }) => (
    <text  x={x} y={y} dy={-4} fill="white" fontSize={16} textAnchor="middle">
      {value}
    </text>
  );
export default SubsPieChart;
