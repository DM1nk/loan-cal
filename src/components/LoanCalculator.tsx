import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CalculatorIcon, RefreshCwIcon, InfoIcon, BanknoteIcon, PercentIcon } from 'lucide-react';
import { calculateLoan, LoanType, LoanSummary } from '../utils/loanCalculations';
import ResultsTabs from './ResultsTabs';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import LoanTermInput from './LoanTermInput';
const LoanCalculator: React.FC = () => {
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const [loanAmount, setLoanAmount] = useState<number>(300000000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(360); // Store term in months
  const [loanType, setLoanType] = useState<LoanType>('evenDistribution');
  const [results, setResults] = useState<LoanSummary | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Handle loan amount input
  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setLoanAmount(value);
    } else {
      setLoanAmount(0);
    }
  };

  // Handle interest rate input
  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setInterestRate(value);
    } else {
      setInterestRate(0);
    }
  };

  // Handle loan term change
  const handleLoanTermChange = (months: number) => {
    setLoanTermMonths(months);
  };

  // Handle loan type change
  const handleLoanTypeChange = (value: LoanType) => {
    setLoanType(value);
    if (results) {
      // Recalculate with the new loan type
      try {
        const calculatedResults = calculateLoan(loanAmount, interestRate, loanTermMonths, value);
        setResults(calculatedResults);
      } catch (error) {
        console.error("Calculation error:", error);
      }
    }
  };

  // Calculate loan results
  const calculateResults = () => {
    // Validate inputs
    if (loanAmount <= 0) {
      toast({
        title: "Số tiền vay không hợp lệ",
        description: "Vui lòng nhập số tiền vay hợp lệ lớn hơn không.",
        variant: "destructive"
      });
      return;
    }
    if (interestRate < 0) {
      toast({
        title: "Lãi suất không hợp lệ",
        description: "Lãi suất không thể là số âm.",
        variant: "destructive"
      });
      return;
    }
    if (loanTermMonths <= 0) {
      toast({
        title: "Thời hạn vay không hợp lệ",
        description: "Vui lòng chọn thời hạn vay lớn hơn không.",
        variant: "destructive"
      });
      return;
    }
    setIsCalculating(true);

    // Small delay to show loading state
    setTimeout(() => {
      try {
        const calculatedResults = calculateLoan(loanAmount, interestRate, loanTermMonths, loanType);
        setResults(calculatedResults);
        toast({
          title: "Tính toán hoàn tất",
          description: "Kết quả tính toán khoản vay của bạn đã được cập nhật."
        });
      } catch (error) {
        console.error("Calculation error:", error);
        toast({
          title: "Lỗi tính toán",
          description: "Đã xảy ra lỗi khi tính toán khoản vay của bạn.",
          variant: "destructive"
        });
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };

  // Reset all inputs
  const resetCalculator = () => {
    setLoanAmount(300000000);
    setInterestRate(5.5);
    setLoanTermMonths(360); // 30 years in months
    setLoanType('evenDistribution');
    setResults(null);
    toast({
      title: "Đặt lại máy tính",
      description: "Tất cả các giá trị đã được đặt lại về mặc định."
    });
  };

  // Format loan amount with commas
  const formattedLoanAmount = loanAmount.toLocaleString();
  return <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <div className="card-gradient p-3 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg animate-fade-in mb-4 sm:mb-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {isMobile ?
        // Mobile layout - single column with compact spacing
        <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="text-sm font-medium flex items-center gap-1">
                    Số Tiền Vay
                    <Tooltip>
                      <TooltipTrigger asChild>
                        
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Tổng số tiền bạn muốn vay</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <BanknoteIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input id="loanAmount" type="text" value={formattedLoanAmount} onChange={handleLoanAmountChange} className="pl-8 h-10 text-base font-medium input-transition" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="text-sm font-medium flex items-center gap-1">
                    Lãi Suất (%)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Lãi suất hàng năm cho khoản vay này</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <PercentIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input id="interestRate" type="number" value={interestRate} onChange={handleInterestRateChange} step="0.1" min="0" max="100" className="pl-8 h-10 text-base font-medium input-transition" />
                  </div>
                </div>

                <LoanTermInput loanTermMonths={loanTermMonths} onChange={handleLoanTermChange} />
              </div>
            </> :
        // Desktop layout 
        <>
              {/* Two column layout for the inputs */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="loanAmount" className="text-base font-medium flex items-center gap-1">
                      Số Tiền Vay
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tổng số tiền bạn muốn vay</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="relative">
                      <BanknoteIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input id="loanAmount" type="text" value={formattedLoanAmount} onChange={handleLoanAmountChange} className="pl-10 h-12 text-lg font-medium input-transition ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="interestRate" className="text-base font-medium flex items-center gap-1">
                      Lãi Suất (%)
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lãi suất hàng năm cho khoản vay này</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="relative">
                      <PercentIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input id="interestRate" type="number" value={interestRate} onChange={handleInterestRateChange} step="0.1" min="0" max="100" className="pl-10 h-12 text-lg font-medium input-transition ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Loan Term Input - Below the two columns */}
              <div className="space-y-3 mt-2">
                <LoanTermInput loanTermMonths={loanTermMonths} onChange={handleLoanTermChange} />
              </div>
            </>}
        </div>
        
        <div className="flex justify-center mt-4 sm:mt-8 gap-2 sm:gap-4">
          <Button onClick={resetCalculator} variant="outline" size="default" className="flex items-center gap-2 font-medium hover:bg-gray-100/70 w-full sm:w-auto">
            <RefreshCwIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:inline">Đặt Lại</span>
          </Button>
          
          <Button onClick={calculateResults} disabled={isCalculating} variant="gradient" size="default" className="flex items-center gap-2 font-medium w-full sm:w-auto">
            <CalculatorIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            {isCalculating ? 'Đang tính...' : 'Tính Toán'}
          </Button>
        </div>
      </div>
      
      <ResultsTabs loanResults={results} loanType={loanType} onLoanTypeChange={handleLoanTypeChange} />
    </div>;
};
export default LoanCalculator;