
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoanSummary, formatCurrency, LoanType } from '../utils/loanCalculations';
import PaymentChart from './PaymentChart';
import PaymentTable from './PaymentTable';
import { ChartBarIcon, TableIcon, Building2Icon, BarChart3Icon, WalletIcon } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';
import StatsCard from './StatsCard';
import MobileStatsCard from './MobileStatsCard';

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

  const handleLoanTypeChange = (value: string) => {
    onLoanTypeChange(value as LoanType);
  };
  
  const renderLoanTypeSelector = () => (
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
  );

  const renderMobileStats = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <MobileStatsCard 
        icon={Building2Icon}
        title="Tổng Thanh Toán"
        value={formatCurrency(loanResults.totalPayment)}
      />
      <MobileStatsCard 
        icon={BarChart3Icon}
        title="Tổng Lãi"
        value={formatCurrency(loanResults.totalInterest)}
      />
    </div>
  );

  const renderDesktopStats = () => (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <StatsCard 
        icon={Building2Icon}
        title="Tổng Thanh Toán"
        value={formatCurrency(loanResults.totalPayment)}
      />
      <StatsCard 
        icon={BarChart3Icon}
        title="Tổng Lãi"
        value={formatCurrency(loanResults.totalInterest)}
      />
      <StatsCard 
        icon={WalletIcon}
        title="Khoản Vay Gốc"
        value={formatCurrency(loanResults.totalPayment - loanResults.totalInterest)}
      />
    </div>
  );
  
  return (
    <div className="card-gradient rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-8 animate-scale-in w-full">
      <h2 className="text-lg sm:text-2xl font-bold text-center mb-3 sm:mb-6">Phân Tích Khoản Vay</h2>
      
      {renderLoanTypeSelector()}
      
      {isMobile ? renderMobileStats() : renderDesktopStats()}
      
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
        <TabsContent value="chart" className="tab-transition w-full min-w-[300px]">
          <PaymentChart data={loanResults.paymentSchedule} />
        </TabsContent>
        <TabsContent value="table" className="tab-transition overflow-hidden w-full">
          <PaymentTable data={loanResults.paymentSchedule} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsTabs;
