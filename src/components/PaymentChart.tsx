
import React, { useEffect, useMemo } from 'react';
import { PaymentDetail } from '../utils/loanCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie, Sector } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChartIcon, PieChartIcon } from 'lucide-react';

interface PaymentChartProps {
  data: PaymentDetail[];
}

const PaymentChart: React.FC<PaymentChartProps> = ({ data }) => {
  // Prepare chart data: We'll show a sample of the data points to avoid overcrowding
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Calculate the number of years in total payments
    const totalYears = Math.ceil(data.length / 12);
    
    // Create a better sampling strategy for more even time intervals
    let sampleData = [];
    
    if (totalYears <= 1) {
      // For loans less than a year, show every month
      sampleData = [...data];
    } else if (totalYears <= 5) {
      // For loans up to 5 years, show every 6 months
      sampleData = data.filter((item, index) => index % 6 === 0);
    } else {
      // For longer loans, show yearly samples
      sampleData = data.filter((item, index) => index % 12 === 0);
      
      // Always include the first and last periods
      if (!sampleData.includes(data[0])) {
        sampleData.unshift(data[0]);
      }
      if (!sampleData.includes(data[data.length - 1])) {
        sampleData.push(data[data.length - 1]);
      }
      
      // Sort by period
      sampleData.sort((a, b) => a.period - b.period);
    }
    
    return sampleData.map((item) => {
      // Simplify the period labels
      let periodLabel;
      if (item.period === 1) {
        periodLabel = "Start"; 
      } else if (item.period === data.length) {
        periodLabel = "End";
      } else if (item.period % 12 === 0) {
        periodLabel = `Y${item.period / 12}`; 
      } else {
        const year = Math.floor(item.period / 12);
        const month = item.period % 12;
        if (year === 0) {
          periodLabel = `M${month}`;
        } else {
          periodLabel = `Y${year+1}`;
        }
      }
      
      return {
        period: periodLabel,
        displayPeriod: item.period,
        principal: parseFloat(item.principal.toFixed(2)),
        interest: parseFloat(item.interest.toFixed(2))
      };
    });
  }, [data]);

  // Prepare summary data for pie chart - simplify to just two values
  const summaryData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const totalPrincipal = data.reduce((sum, item) => sum + item.principal, 0);
    const totalInterest = data.reduce((sum, item) => sum + item.interest, 0);
    
    return [
      { name: 'Principal', value: parseFloat(totalPrincipal.toFixed(2)), fill: '#3b82f6' },
      { name: 'Interest', value: parseFloat(totalInterest.toFixed(2)), fill: '#93c5fd' }
    ];
  }, [data]);

  const COLORS = {
    principal: '#3b82f6', // Primary blue
    interest: '#93c5fd'   // Light blue
  };

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64">No data to display</div>;
  }

  // Simplified active shape for the pie chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" className="text-lg font-medium">
          {`${payload.name}: $${value.toLocaleString()}`}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full animate-fade-in">
      <div className="p-4 mb-2">
        <h3 className="text-lg font-medium text-center">Payment Breakdown</h3>
      </div>
      
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto mb-4">
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChartIcon className="w-4 h-4" />
            <span>Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            <span>Summary</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bar" className="tab-transition">
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                barGap={0}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                  height={40}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    const label = name === "Principal" ? "Principal" : "Interest";
                    return [`$${value.toLocaleString()}`, label];
                  }}
                  contentStyle={{ 
                    borderRadius: 8, 
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
                />
                <Legend />
                <Bar 
                  name="Principal" 
                  dataKey="principal" 
                  stackId="a" 
                  fill={COLORS.principal}
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  name="Interest" 
                  dataKey="interest" 
                  stackId="a" 
                  fill={COLORS.interest}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="pie" className="tab-transition">
          <div className="w-full h-[350px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={0}
                  activeShape={renderActiveShape}
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentChart;
