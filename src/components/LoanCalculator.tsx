
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { CalculatorIcon, RefreshCwIcon, InfoIcon } from 'lucide-react';
import { calculateLoan, LoanType, LoanSummary } from '../utils/loanCalculations';
import ResultsTabs from './ResultsTabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LoanCalculator: React.FC = () => {
  const { toast } = useToast();
  
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [loanTerm, setLoanTerm] = useState<number>(30);
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass p-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="loanAmount"
                  type="text"
                  value={formattedLoanAmount}
                  onChange={handleLoanAmountChange}
                  className="pl-7 input-transition"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <div className="relative">
                <Input
                  id="interestRate"
                  type="number"
                  value={interestRate}
                  onChange={handleInterestRateChange}
                  step="0.1"
                  min="0"
                  max="100"
                  className="pr-7 input-transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="loanTerm">Loan Term (Years): {loanTerm}</Label>
              </div>
              <Slider
                id="loanTerm"
                defaultValue={[loanTerm]}
                max={40}
                min={1}
                step={1}
                onValueChange={handleTermSliderChange}
                className="input-transition"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 Year</span>
                <span>40 Years</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="loanType">Loan Type</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p><strong>Even Distribution:</strong> {loanTypeDescriptions.evenDistribution}</p>
                    <p><strong>Fixed Principal:</strong> {loanTypeDescriptions.fixedPrincipal}</p>
                    <p><strong>Fixed Interest:</strong> {loanTypeDescriptions.fixedInterest}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={loanType}
                onValueChange={handleLoanTypeChange}
              >
                <SelectTrigger id="loanType" className="input-transition">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="evenDistribution">Even Distribution (Equal Payments)</SelectItem>
                  <SelectItem value="fixedPrincipal">Fixed Principal</SelectItem>
                  <SelectItem value="fixedInterest">Fixed Interest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 space-x-4">
          <Button 
            onClick={resetCalculator}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCwIcon className="h-4 w-4" />
            Reset
          </Button>
          
          <Button 
            onClick={calculateResults}
            disabled={isCalculating}
            className="flex items-center gap-2"
          >
            <CalculatorIcon className="h-4 w-4" />
            {isCalculating ? 'Calculating...' : 'Calculate'}
          </Button>
        </div>
      </div>
      
      <ResultsTabs loanResults={results} />
    </div>
  );
};

export default LoanCalculator;
