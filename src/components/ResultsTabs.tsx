import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoanSummary, formatCurrency } from '../utils/loanCalculations';
import PaymentChart from './PaymentChart';
import PaymentTable from './PaymentTable';
import { ChartBarIcon, TableIcon, InfoIcon, BarChart3Icon, CircleDollarSignIcon, Building2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

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
  
  // Calculate percentage of first year payment that goes to principal vs interest
  const totalFirstYearPayment = firstYearPrincipal + firstYearInterest;
  const principalPercentage = (firstYearPrincipal / totalFirstYearPayment) * 100;
  const interestPercentage = (firstYearInterest / totalFirstYearPayment) * 100;

  return (
    <div className="card-gradient rounded-2xl shadow-lg p-8 animate-scale-in">
      <h2 className="text-2xl font-bold text-center mb-6">Loan Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="mb-2">
            <CircleDollarSignIcon className="h-10 w-10 text-primary/80 mb-1" />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Monthly Payment</h3>
          <p className="text-3xl font-bold text-primary">{formatCurrency(loanResults.monthlyPayment)}</p>
        </div>
        
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="mb-2">
            <Building2Icon className="h-10 w-10 text-primary/80 mb-1" />
          </div>
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
          <p className="text-3xl font-bold text-primary">{formatCurrency(loanResults.totalPayment)}</p>
        </div>
        
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <div className="mb-2">
            <BarChart3Icon className="h-10 w-10 text-primary/80 mb-1" />
          </div>
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
          <p className="text-3xl font-bold text-primary">{formatCurrency(loanResults.totalInterest)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm">
          <h3 className="text-base font-medium mb-4">First Year Breakdown</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Principal</p>
                <p className="text-sm font-medium">{formatCurrency(firstYearPrincipal)} ({principalPercentage.toFixed(1)}%)</p>
              </div>
              <Progress value={principalPercentage} className="h-2 bg-blue-100" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Interest</p>
                <p className="text-sm font-medium">{formatCurrency(firstYearInterest)} ({interestPercentage.toFixed(1)}%)</p>
              </div>
              <Progress value={interestPercentage} className="h-2 bg-blue-100" />
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm">
          <h3 className="text-base font-medium mb-4">Loan Summary</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Principal</p>
                <p className="text-base font-medium">{formatCurrency(principal)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Interest</p>
                <p className="text-base font-medium">{formatCurrency(loanResults.totalInterest)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Interest-to-Principal Ratio</p>
                <p className="text-base font-medium">{interestToLoanRatio.toFixed(1)}%</p>
              </div>
              <Progress value={interestToLoanRatio > 100 ? 100 : interestToLoanRatio} className="h-2 bg-blue-100" />
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="chart" className="flex items-center gap-2 text-base p-6">
            <ChartBarIcon className="w-5 h-5" />
            <span>Payment Charts</span>
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2 text-base p-6">
            <TableIcon className="w-5 h-5" />
            <span>Payment Schedule</span>
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
