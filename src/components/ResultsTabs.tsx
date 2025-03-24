
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoanSummary, formatCurrency } from '../utils/loanCalculations';
import PaymentChart from './PaymentChart';
import PaymentTable from './PaymentTable';
import { ChartBarIcon, TableIcon, CircleDollarSignIcon, Building2Icon, BarChart3Icon } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsTabsProps {
  loanResults: LoanSummary | null;
}

const ResultsTabs: React.FC<ResultsTabsProps> = ({
  loanResults
}) => {
  const isMobile = useIsMobile();
  
  if (!loanResults) {
    return null;
  }
  
  return <div className="card-gradient rounded-2xl shadow-lg p-4 sm:p-8 animate-scale-in">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Loan Analysis</h2>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="p-3 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all duration-200">
          <div className="mb-1 sm:mb-2">
            <Building2Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary/80 mb-1" />
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Payment</h3>
          <p className="text-lg sm:text-3xl font-bold text-primary">{formatCurrency(loanResults.totalPayment)}</p>
        </div>
        
        <div className="p-3 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all duration-200">
          <div className="mb-1 sm:mb-2">
            <BarChart3Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary/80 mb-1" />
          </div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Interest</h3>
          <p className="text-lg sm:text-3xl font-bold text-primary">{formatCurrency(loanResults.totalInterest)}</p>
        </div>
      </div>
      
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
          <TabsTrigger value="chart" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base p-2 sm:p-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
            <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isMobile ? "Chart" : "Payment Charts"}</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base p-2 sm:p-4 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
            <TableIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isMobile ? "Schedule" : "Payment Schedule"}</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="tab-transition">
          <PaymentChart data={loanResults.paymentSchedule} />
        </TabsContent>
        <TabsContent value="table" className="tab-transition overflow-hidden">
          <PaymentTable data={loanResults.paymentSchedule} />
        </TabsContent>
      </Tabs>
    </div>;
};

export default ResultsTabs;
