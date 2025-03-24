
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
    } else if (totalYears <= 3) {
      // For 1-3 year loans, show every 3 months (quarterly)
      sampleData = data.filter((item, index) => index % 3 === 0);
    } else if (totalYears <= 10) {
      // For 3-10 year loans, show every 6 months (semi-annually)
      sampleData = data.filter((item, index) => index % 6 === 0);
    } else {
      // For 10+ year loans, show yearly samples
      sampleData = data.filter((item, index) => index % 12 === 0);
      
      // Always include the first month to show the start point
      if (!sampleData.includes(data[0])) {
        sampleData.unshift(data[0]);
      }
      
      // Always include the last month to show the end point
      if (!sampleData.includes(data[data.length - 1])) {
        sampleData.push(data[data.length - 1]);
      }
      
      // Sort by period to ensure correct order
      sampleData.sort((a, b) => a.period - b.period);
    }
    
    return sampleData.map((item) => {
      // Format the period label more clearly
      let periodLabel;
      if (item.period === 1) {
        periodLabel = "Month 1"; // First month
      } else if (item.period % 12 === 0) {
        periodLabel = `Year ${item.period / 12}`; // Full years
      } else {
        const year = Math.floor(item.period / 12);
        const month = item.period % 12;
        periodLabel = `Y${year+1}M${month}`; // Year and month
      }
      
      return {
        period: periodLabel,
        displayPeriod: item.period, // Keep original period for tooltip
        principal: parseFloat(item.principal.toFixed(2)),
        interest: parseFloat(item.interest.toFixed(2))
      };
    });
  }, [data]);

  // Prepare summary data for pie chart
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

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
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
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <text x={cx} y={cy - 20} dy={8} textAnchor="middle" fill="#333" className="text-lg">
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#333">
          ${value.toLocaleString()}
        </text>
        <text x={cx} y={cy + 30} textAnchor="middle" fill="#999">
          {`${(percent * 100).toFixed(2)}%`}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full animate-fade-in">
      <div className="p-4 mb-4">
        <h3 className="text-lg font-medium text-center">Payment Breakdown</h3>
        <p className="text-sm text-center text-muted-foreground">
          Chart showing principal vs interest over time
        </p>
      </div>
      
      <Tabs defaultValue="bar" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto mb-6">
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
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                barGap={0}
                barCategoryGap="10%"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="period" 
                  angle={-45} 
                  textAnchor="end" 
                  tick={{ fontSize: 12 }}
                  height={70}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => {
                    const displayPeriod = props.payload.displayPeriod;
                    const suffix = name === "Principal" ? " (Principal)" : " (Interest)";
                    // Return formatted value with period information
                    return [`$${value.toLocaleString()}${suffix}`, `Period ${displayPeriod}`];
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
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Bar 
                  name="Interest" 
                  dataKey="interest" 
                  stackId="a" 
                  fill={COLORS.interest}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  animationBegin={300}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="pie" className="tab-transition">
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={0}
                  activeShape={renderActiveShape}
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ 
                    borderRadius: 8, 
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)'
                  }}
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
