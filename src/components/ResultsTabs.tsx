
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoanSummary, formatCurrency } from '../utils/loanCalculations';
import PaymentChart from './PaymentChart';
import PaymentTable from './PaymentTable';
import { ChartBarIcon, TableIcon, InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ResultsTabsProps {
  loanResults: LoanSummary | null;
}

const ResultsTabs: React.FC<ResultsTabsProps> = ({ loanResults }) => {
  if (!loanResults) {
    return null;
  }

  // Calculate loan metrics
  const principal = loanResults.totalPayment - loanResults.totalInterest;
  const interestToLoanRatio = (loanResults.totalInterest / principal) * 100;
  const firstYearPayments = loanResults.paymentSchedule.slice(0, 12);
  const firstYearPrincipal = firstYearPayments.reduce((sum, payment) => sum + payment.principal, 0);
  const firstYearInterest = firstYearPayments.reduce((sum, payment) => sum + payment.interest, 0);

  return (
    <div className="mt-8 glass p-6 animate-scale-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Payment</h3>
          <p className="text-2xl font-bold text-primary">{formatCurrency(loanResults.monthlyPayment)}</p>
        </div>
        <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Payment</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Principal + Total Interest</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(loanResults.totalPayment)}</p>
        </div>
        <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Interest</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{interestToLoanRatio.toFixed(1)}% of loan amount</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-2xl font-bold text-primary">{formatCurrency(loanResults.totalInterest)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">First Year Breakdown</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Principal</p>
              <p className="text-base font-medium">{formatCurrency(firstYearPrincipal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Interest</p>
              <p className="text-base font-medium">{formatCurrency(firstYearInterest)}</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Loan Summary</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Principal</p>
              <p className="text-base font-medium">{formatCurrency(principal)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Interest-to-Principal</p>
              <p className="text-base font-medium">{interestToLoanRatio.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="chart" className="flex items-center gap-2">
            <ChartBarIcon className="w-4 h-4" />
            <span>Chart</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <TableIcon className="w-4 h-4" />
            <span>Payment Table</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="tab-transition">
          <PaymentChart data={loanResults.paymentSchedule} />
        </TabsContent>
        <TabsContent value="table" className="tab-transition overflow-hidden">
          <PaymentTable data={loanResults.paymentSchedule} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsTabs;
