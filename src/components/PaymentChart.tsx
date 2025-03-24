
import React, { useMemo } from 'react';
import { PaymentDetail } from '../utils/loanCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";

interface PaymentChartProps {
  data: PaymentDetail[];
}

const PaymentChart: React.FC<PaymentChartProps> = ({ data }) => {
  const isMobile = useIsMobile();
  
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
    
    // Further reduce sampling on mobile for better readability
    if (isMobile && sampleData.length > 6) {
      // For mobile, if we have more than 6 samples, reduce it further
      const step = Math.ceil(sampleData.length / 6);
      sampleData = sampleData.filter((_, index) => index % step === 0 || index === sampleData.length - 1);
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
  }, [data, isMobile]);

  const COLORS = {
    principal: '#3b82f6', // Primary blue
    interest: '#93c5fd'   // Light blue
  };

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64">No data to display</div>;
  }

  return (
    <div className="w-full h-full animate-fade-in">
      <div className={`${isMobile ? 'p-2 mb-1' : 'p-4 mb-2'}`}>
        <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-center`}>Payment Breakdown</h3>
      </div>
      
      <div className={`w-full ${isMobile ? 'h-[260px]' : 'h-[350px]'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={isMobile ? 
              { top: 10, right: 5, left: 0, bottom: 40 } : 
              { top: 20, right: 30, left: 20, bottom: 50 }}
            barGap={0}
            barCategoryGap={isMobile ? "10%" : "20%"}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: isMobile ? 10 : 12 }}
              height={isMobile ? 30 : 40}
              interval={isMobile ? 0 : 'preserveStartEnd'}
              tickMargin={isMobile ? 5 : 10}
            />
            <YAxis 
              width={isMobile ? 35 : 45}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickFormatter={(value) => {
                if (isMobile) {
                  // Simplify Y-axis formatting on mobile
                  if (value >= 1000) {
                    return `${(value/1000).toFixed(0)}K`;
                  }
                  return value;
                }
                return value;
              }}
            />
            <Tooltip 
              formatter={(value, name) => {
                const label = name === "Principal" ? "Principal" : "Interest";
                return [`$${value.toLocaleString()}`, label];
              }}
              contentStyle={{ 
                borderRadius: 8, 
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: isMobile ? '4px 8px' : '8px 12px',
                fontSize: isMobile ? '11px' : '12px'
              }}
              wrapperStyle={{
                fontSize: isMobile ? '11px' : '12px'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontSize: isMobile ? '10px' : '12px',
                paddingTop: isMobile ? '5px' : '10px'
              }}
            />
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
    </div>
  );
};

export default PaymentChart;
