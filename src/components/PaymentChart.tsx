
import React, { useEffect, useMemo } from 'react';
import { PaymentDetail } from '../utils/loanCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface PaymentChartProps {
  data: PaymentDetail[];
}

const PaymentChart: React.FC<PaymentChartProps> = ({ data }) => {
  // Prepare chart data: We'll show a sample of the data points to avoid overcrowding
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // If we have a lot of payments, sample them to avoid chart overcrowding
    let sampleData = [...data];
    if (data.length > 24) {
      // Sample data for first year (monthly), then yearly after that
      sampleData = data.filter((item, index) => 
        index < 12 || // First year: show every month
        index % 12 === 0 // After first year: show yearly samples
      );
    }
    
    return sampleData.map((item) => ({
      period: item.period <= 12 
        ? `Month ${item.period}` 
        : `Year ${Math.ceil(item.period / 12)}`,
      principal: parseFloat(item.principal.toFixed(2)),
      interest: parseFloat(item.interest.toFixed(2))
    }));
  }, [data]);

  const COLORS = {
    principal: '#3b82f6', // Primary blue
    interest: '#93c5fd'   // Light blue
  };

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64">No data to display</div>;
  }

  return (
    <div className="w-full h-full animate-fade-in">
      <div className="p-4 mb-4">
        <h3 className="text-lg font-medium text-center">Payment Breakdown</h3>
        <p className="text-sm text-center text-muted-foreground">
          Chart showing principal vs interest over time
        </p>
      </div>
      
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
              formatter={(value) => [`$${value}`, '']}
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
    </div>
  );
};

export default PaymentChart;
