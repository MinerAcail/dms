import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Sector, Cell } from "recharts";

interface DataEntry {
  name: string;
  value: number;
}
const data = [
  { name: "Dominion", value: 420 },
  { name: "Teens", value: 30 },
  { name: "NGC", value: 300 },
  { name: "Children", value: 100 },
];
const data1 = [
  { name: "Dominion", value: 42 },
  { name: "Teens", value: 302 },
  { name: "NGC", value: 30 },
  { name: "Children", value: 10 },
];
interface CustomActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: DataEntry;
  percent: number;
  value: number;
  name: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;

const renderActiveShape = (props: CustomActiveShapeProps) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    name,
  } = props;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 40) * cos; // Adjust the radius here
  const my = cy + (outerRadius + 40) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="white"
        fontSize={17}
      >
        {`${value} => Rate ${(percent * 100).toFixed(2)}%`}
      </text>
    </g>
  );
};

const PieChartExample: React.FC = ({toggleVisibility,isHidden,cx,cx1,outerRadius,outerRadius1}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onPieEnter = (_: any, index: React.SetStateAction<number>) => {
    setActiveIndex(index);
  };
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const group = data[index].name;
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
        <tspan x={x} dy="1.3em">
          {group}
        </tspan>
      </text>
    );
  };
  return (
    <>
    
    <Button className="toggle-button" onClick={toggleVisibility}>
        {isHidden ? 'Show Graph' : 'Hide Graph'}
      </Button>
    <ResponsiveContainer width="100%" height="100%">
    <PieChart width={400} height={400}>
      <Pie
        activeIndex={activeIndex}
        activeShape={(props: any) => renderActiveShape(props)}
        data={data}
        cx={cx}
        cy="33%"
        innerRadius={60}
        outerRadius={outerRadius}
        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter}
        label={renderCustomizedLabel}
        paddingAngle={5}
      >
        {data.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Pie
        activeIndex={activeIndex}
        activeShape={(props: any) => renderActiveShape(props)}
        data={data1}
        cx={cx1}

        
        cy="75%"
        innerRadius={60}
       
        outerRadius={outerRadius1}

        fill="#8884d8"
        dataKey="value"
        onMouseEnter={onPieEnter}
        label={renderCustomizedLabel}
        paddingAngle={5}
      >
        {data1.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
    </PieChart>
  </ResponsiveContainer>
    </>
  
   
  );
};

export default PieChartExample;
