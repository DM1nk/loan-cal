import React, { useMemo } from 'react';
import { PaymentDetail } from '../utils/loanCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";
import styles from './PaymentChart.module.css';

interface PaymentChartProps {
  data: PaymentDetail[];
}

const PaymentChart: React.FC<PaymentChartProps> = ({
  data
}) => {
  const isMobile = useIsMobile();

  // Prepare chart data: We'll show a sample of the data points to avoid overcrowding
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Calculate the number of years in total payments
    const totalYears = Math.ceil(data.length / 12);
    const totalMonths = data.length;

    // Create a better sampling strategy for more even time intervals
    let sampleData = [];
    if (totalMonths <= 12) {
      // For loans less than a year, show every month or every other month
      if (totalMonths <= 6) {
        sampleData = [...data];
      } else {
        sampleData = data.filter((item, index) => index % 2 === 0);
      }
    } else if (totalYears <= 1) {
      // For loans less than a year, show every month
      sampleData = [...data];
    } else if (totalYears <= 5) {
      // For loans up to 5 years, show every 6 months
      sampleData = data.filter((item, index) => index % 6 === 0);
    } else {
      // For longer loans, show yearly samples
      sampleData = data.filter((item, index) => index % 12 === 0);
    }

    // Always include the first and last periods
    if (sampleData.length > 0 && !sampleData.includes(data[0])) {
      sampleData.unshift(data[0]);
    }
    if (sampleData.length > 0 && !sampleData.includes(data[data.length - 1])) {
      sampleData.push(data[data.length - 1]);
    }

    // Sort by period
    sampleData.sort((a, b) => a.period - b.period);

    // Further reduce sampling on mobile for better readability
    if (isMobile && sampleData.length > 6) {
      // For mobile, if we have more than 6 samples, reduce it further
      const step = Math.ceil(sampleData.length / 6);
      sampleData = sampleData.filter((_, index) => index % step === 0 || index === sampleData.length - 1);
    }
    return sampleData.map(item => {
      // Simplify the period labels
      let periodLabel;
      if (totalMonths <= 12) {
        // For loans under 1 year, show as "T1", "T2", etc.
        if (item.period === 1) {
          periodLabel = "Bắt Đầu";
        } else if (item.period === data.length) {
          periodLabel = "Kết Thúc";
        } else {
          periodLabel = `T${item.period}`;
        }
      } else {
        // For longer loans
        if (item.period === 1) {
          periodLabel = "Bắt Đầu";
        } else if (item.period === data.length) {
          periodLabel = "Kết Thúc";
        } else if (item.period % 12 === 0) {
          periodLabel = `N${item.period / 12}`;
        } else {
          const year = Math.floor(item.period / 12);
          const month = item.period % 12;
          if (year === 0) {
            periodLabel = `T${month}`;
          } else {
            periodLabel = `N${year + 1}`;
          }
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
    principal: '#3b82f6',
    // Primary blue
    interest: '#93c5fd' // Light blue
  };
  if (!data || data.length === 0) {
    return <div className={styles.noData}>No data to display</div>;
  }
  return <div className={styles.container}>
      <div className={isMobile ? styles.headerMobile : styles.header}>
        <h3 className={isMobile ? styles.titleMobile : styles.title}>
          Biểu đồ thanh toán
        </h3>
      </div>
      
      <div className={isMobile ? styles.chartContainerMobile : styles.chartContainer}>
        <div className={styles.loanChart}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={isMobile ? {
                top: 10,
                right: 5,
                left: 0,
                bottom: 40
              } : {
                top: 20,
                right: 30,
                left: 20,
                bottom: 50
              }} 
              barGap={0} 
              barCategoryGap={isMobile ? "10%" : "20%"}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="period" 
                tick={{
                  fontSize: isMobile ? 10 : 12
                }} 
                height={isMobile ? 30 : 40} 
                interval={isMobile ? 0 : 'preserveStartEnd'} 
                tickMargin={isMobile ? 5 : 10}
              />
              <YAxis 
                width={isMobile ? 35 : 45} 
                tick={{
                  fontSize: isMobile ? 10 : 12
                }} 
                tickFormatter={value => {
                  if (isMobile) {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}Tr`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    }
                    return value.toLocaleString('vi-VN').replace(/,/g, '.').replace(/\./g, ',');
                  }
                  return value.toLocaleString('vi-VN').replace(/,/g, '.').replace(/\./g, ',');
                }}
              />
              <Tooltip 
                formatter={(value, name) => {
                  const label = name === "Principal" ? "Gốc" : "Lãi";
                  const formattedValue = value.toLocaleString('vi-VN').replace(/,/g, '.').replace(/\./g, ',');
                  return [`${formattedValue} ₫`, label];
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
                name="Gốc" 
                dataKey="principal" 
                stackId="a" 
                fill={COLORS.principal} 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                name="Lãi" 
                dataKey="interest" 
                stackId="a" 
                fill={COLORS.interest} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>;
};
export default PaymentChart;