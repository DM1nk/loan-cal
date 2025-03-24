
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { CalculatorIcon, RefreshCwIcon, InfoIcon, DollarSignIcon, PercentIcon } from 'lucide-react';
import { calculateLoan, LoanType, LoanSummary } from '../utils/loanCalculations';
import ResultsTabs from './ResultsTabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";

const LoanCalculator: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [loanType, setLoanType] = useState<LoanType>('evenDistribution');
  const [results, setResults] = useState<LoanSummary | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
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
  
  // Handle loan term slider change
  const handleTermSliderChange = (value: number[]) => {
    setLoanTerm(value[0]);
  };
  
  // Handle loan type selection
  const handleLoanTypeChange = (value: string) => {
    setLoanType(value as LoanType);
  };
  
  // Calculate loan results
  const calculateResults = () => {
    // Validate inputs
    if (loanAmount <= 0) {
      toast({
        title: "Invalid loan amount",
        description: "Please enter a valid loan amount greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (interestRate < 0) {
      toast({
        title: "Invalid interest rate",
        description: "Interest rate cannot be negative.",
        variant: "destructive"
      });
      return;
    }
    
    if (loanTerm <= 0) {
      toast({
        title: "Invalid loan term",
        description: "Please select a loan term greater than zero.",
        variant: "destructive"
      });
      return;
    }
    
    setIsCalculating(true);
    
    // Small delay to show loading state
    setTimeout(() => {
      try {
        const calculatedResults = calculateLoan(loanAmount, interestRate, loanTerm, loanType);
        setResults(calculatedResults);
        
        toast({
          title: "Calculation complete",
          description: "Your loan calculation has been updated.",
        });
      } catch (error) {
        console.error("Calculation error:", error);
        toast({
          title: "Calculation error",
          description: "An error occurred while calculating your loan.",
          variant: "destructive"
        });
      } finally {
        setIsCalculating(false);
      }
    }, 500);
  };
  
  // Reset all inputs
  const resetCalculator = () => {
    setLoanAmount(300000);
    setInterestRate(5.5);
    setLoanTerm(30);
    setLoanType('evenDistribution');
    setResults(null);
    
    toast({
      title: "Calculator reset",
      description: "All values have been reset to defaults.",
    });
  };
  
  // Format loan amount with commas
  const formattedLoanAmount = loanAmount.toLocaleString();

  // Loan type descriptions for tooltips
  const loanTypeDescriptions = {
    evenDistribution: "Equal monthly payments throughout the loan term (traditional amortization).",
    fixedPrincipal: "Principal payment stays the same, total payment decreases over time.",
    fixedInterest: "Interest payment stays the same, total payment remains constant."
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <div className="card-gradient p-3 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg animate-fade-in mb-4 sm:mb-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-8">
          {isMobile ? (
            // Mobile layout - single column with compact spacing
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount" className="text-sm font-medium flex items-center gap-1">
                    Loan Amount
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">The total amount you wish to borrow</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="loanAmount"
                      type="text"
                      value={formattedLoanAmount}
                      onChange={handleLoanAmountChange}
                      className="pl-8 h-10 text-base font-medium input-transition"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="text-sm font-medium flex items-center gap-1">
                    Interest Rate (%)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">Annual interest rate for this loan</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <PercentIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={handleInterestRateChange}
                      step="0.1"
                      min="0"
                      max="100"
                      className="pl-8 h-10 text-base font-medium input-transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="loanTerm" className="text-sm font-medium flex items-center gap-1">
                      Loan Term 
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p className="text-xs">Length of the loan in years</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="text-base font-semibold text-primary">{loanTerm} {loanTerm === 1 ? 'Year' : 'Years'}</span>
                  </div>
                  <Slider
                    id="loanTerm"
                    defaultValue={[loanTerm]}
                    max={40}
                    min={1}
                    step={1}
                    onValueChange={handleTermSliderChange}
                    className="input-transition py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 Year</span>
                    <span>40 Years</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="loanType" className="text-sm font-medium">Loan Type</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-[250px]">
                        <div className="text-xs space-y-1">
                          <p><strong>Even Distribution:</strong> Equal monthly payments</p>
                          <p><strong>Fixed Principal:</strong> Same principal amount each month</p>
                          <p><strong>Fixed Interest:</strong> Same interest amount each month</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <Select
                    value={loanType}
                    onValueChange={handleLoanTypeChange}
                  >
                    <SelectTrigger id="loanType" className="h-10">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evenDistribution">Even Distribution</SelectItem>
                      <SelectItem value="fixedPrincipal">Fixed Principal</SelectItem>
                      <SelectItem value="fixedInterest">Fixed Interest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            // Desktop layout - two columns
            <>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="loanAmount" className="text-base font-medium flex items-center gap-1">
                    Loan Amount
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The total amount you wish to borrow</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      id="loanAmount"
                      type="text"
                      value={formattedLoanAmount}
                      onChange={handleLoanAmountChange}
                      className="pl-10 h-12 text-lg font-medium input-transition ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="interestRate" className="text-base font-medium flex items-center gap-1">
                    Interest Rate (%)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Annual interest rate for this loan</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="relative">
                    <PercentIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={handleInterestRateChange}
                      step="0.1"
                      min="0"
                      max="100"
                      className="pl-10 h-12 text-lg font-medium input-transition ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="loanTerm" className="text-base font-medium flex items-center gap-1">
                      Loan Term 
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Length of the loan in years</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="text-xl font-semibold text-primary">{loanTerm} {loanTerm === 1 ? 'Year' : 'Years'}</span>
                  </div>
                  <Slider
                    id="loanTerm"
                    defaultValue={[loanTerm]}
                    max={40}
                    min={1}
                    step={1}
                    onValueChange={handleTermSliderChange}
                    className="input-transition py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 Year</span>
                    <span>40 Years</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="loanType" className="text-base font-medium">Loan Type</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-4">
                        <h4 className="font-semibold mb-2">Payment Types:</h4>
                        <ul className="space-y-2">
                          <li><strong>Even Distribution:</strong> {loanTypeDescriptions.evenDistribution}</li>
                          <li><strong>Fixed Principal:</strong> {loanTypeDescriptions.fixedPrincipal}</li>
                          <li><strong>Fixed Interest:</strong> {loanTypeDescriptions.fixedInterest}</li>
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <Select
                    value={loanType}
                    onValueChange={handleLoanTypeChange}
                  >
                    <SelectTrigger id="loanType" className="h-12 input-transition">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evenDistribution">Even Distribution (Equal Payments)</SelectItem>
                      <SelectItem value="fixedPrincipal">Fixed Principal</SelectItem>
                      <SelectItem value="fixedInterest">Fixed Interest</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                    <CollapsibleTrigger asChild>
                      <Button variant="link" size="sm" className="p-0 h-auto text-sm">
                        {isOpen ? "Hide explanation" : "What's the difference?"}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 p-3 bg-muted/30 rounded-md text-sm text-muted-foreground">
                      <p className="mb-1"><strong>Even Distribution:</strong> The most common type, with equal monthly payments (like most mortgages).</p>
                      <p className="mb-1"><strong>Fixed Principal:</strong> You pay the same amount toward principal each month, but less interest over time as your balance decreases.</p>
                      <p><strong>Fixed Interest:</strong> The interest portion stays fixed, resulting in consistent total payments.</p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-center mt-4 sm:mt-8 gap-2 sm:gap-4">
          <Button 
            onClick={resetCalculator}
            variant="outline"
            size="default"
            className="flex items-center gap-2 font-medium hover:bg-gray-100/70 w-full sm:w-auto"
          >
            <RefreshCwIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sm:inline">Reset</span>
          </Button>
          
          <Button 
            onClick={calculateResults}
            disabled={isCalculating}
            variant="gradient"
            size="default"
            className="flex items-center gap-2 font-medium w-full sm:w-auto"
          >
            <CalculatorIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </Button>
        </div>
      </div>
      
      <ResultsTabs loanResults={results} />
    </div>
  );
};

export default LoanCalculator;
