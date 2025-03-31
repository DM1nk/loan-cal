import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoanSummary, formatCurrency, LoanType } from '../utils/loanCalculations';
import PaymentChart from './PaymentChart';
import PaymentTable from './PaymentTable';
import { ChartBarIcon, TableIcon, Building2Icon, BarChart3Icon } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';

interface ResultsTabsProps {
  loanResults: LoanSummary | null;
  loanType: LoanType;
  onLoanTypeChange: (value: LoanType) => void;
}

const ResultsTabs: React.FC<ResultsTabsProps> = ({
  loanResults,
  loanType,
  onLoanTypeChange
}) => {
  const isMobile = useIsMobile();
  
  if (!loanResults) {
    return null;
  }

  // Loan type descriptions for tooltips
  const loanTypeDescriptions = {
    evenDistribution: "Khoản thanh toán hàng tháng bằng nhau trong suốt thời hạn vay (trả góp truyền thống).",
    fixedPrincipal: "Khoản thanh toán gốc giữ nguyên, tổng khoản thanh toán giảm dần theo thời gian.",
    fixedInterest: "Khoản thanh toán lãi giữ nguyên, tổng khoản thanh toán không đổi."
  };

  const handleLoanTypeChange = (value: string) => {
    onLoanTypeChange(value as LoanType);
  };
  
  return (
    <div className="card-gradient rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-8 animate-scale-in">
      <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6">Phân Tích Khoản Vay</h2>
      
      {/* Loan Type Selection - Now in the results section */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-1 mb-1">
          <Label htmlFor="resultLoanType" className="text-sm sm:text-base font-medium">Loại Khoản Vay</Label>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[250px]">
              <div className="text-xs sm:text-sm space-y-1">
                <p><strong>Phân bổ đều:</strong> Khoản thanh toán hàng tháng bằng nhau</p>
                <p><strong>Gốc cố định:</strong> Khoản gốc giữ nguyên mỗi tháng</p>
                <p><strong>Lãi cố định:</strong> Khoản lãi giữ nguyên mỗi tháng</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <Select
          value={loanType}
          onValueChange={handleLoanTypeChange}
        >
          <SelectTrigger id="resultLoanType" className="h-10 sm:h-12 input-transition">
            <SelectValue placeholder="Chọn loại khoản vay" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="evenDistribution">Phân Bổ Đều (Khoản Thanh Toán Bằng Nhau)</SelectItem>
            <SelectItem value="fixedPrincipal">Gốc Cố Định</SelectItem>
            <SelectItem value="fixedInterest">Lãi Cố Định</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isMobile ? (
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex-1 min-w-[48%] p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center">
            <Building2Icon className="h-6 w-6 text-primary/80 mb-1" />
            <h3 className="text-xs font-medium text-gray-500">Tổng Thanh Toán</h3>
            <p className="text-base font-bold text-primary">{formatCurrency(loanResults.totalPayment)}</p>
          </div>
          
          <div className="flex-1 min-w-[48%] p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center">
            <BarChart3Icon className="h-6 w-6 text-primary/80 mb-1" />
            <h3 className="text-xs font-medium text-gray-500">Tổng Lãi</h3>
            <p className="text-base font-bold text-primary">{formatCurrency(loanResults.totalInterest)}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="p-3 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all duration-200">
            <div className="mb-1 sm:mb-2">
              <Building2Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary/80 mb-1" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Tổng Thanh Toán</h3>
            <p className="text-lg sm:text-3xl font-bold text-primary">{formatCurrency(loanResults.totalPayment)}</p>
          </div>
          
          <div className="p-3 sm:p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-all duration-200">
            <div className="mb-1 sm:mb-2">
              <BarChart3Icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary/80 mb-1" />
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Tổng Lãi</h3>
            <p className="text-lg sm:text-3xl font-bold text-primary">{formatCurrency(loanResults.totalInterest)}</p>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-6 p-1 bg-muted/50 backdrop-blur-sm rounded-lg sm:rounded-xl">
          <TabsTrigger 
            value="chart" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base p-1.5 sm:p-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
          >
            <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isMobile ? "Biểu Đồ" : "Lộ Trình Thanh Toán"}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="table" 
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-base p-1.5 sm:p-4 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
          >
            <TableIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isMobile ? "Lịch Trình" : "Lịch Trình Thanh Toán"}</span>
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
