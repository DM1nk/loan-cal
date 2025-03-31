
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { InfoIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LoanTermInputProps {
  loanTermMonths: number;
  onChange: (months: number) => void;
}

const LoanTermInput: React.FC<LoanTermInputProps> = ({ loanTermMonths, onChange }) => {
  // Auto decide display mode based on number of months
  const [displayMode, setDisplayMode] = useState<"years" | "months">(
    loanTermMonths >= 12 ? "years" : "months"
  );
  
  // Calculate display value based on current mode
  const [inputValue, setInputValue] = useState(() => 
    displayMode === "years" 
      ? Math.round(loanTermMonths / 12).toString()
      : loanTermMonths.toString()
  );

  // Update input when external term changes
  useEffect(() => {
    if (loanTermMonths < 12) {
      setDisplayMode("months");
      setInputValue(loanTermMonths.toString());
    } else {
      if (displayMode === "years") {
        setInputValue(Math.round(loanTermMonths / 12).toString());
      } else {
        setInputValue(loanTermMonths.toString());
      }
    }
  }, [loanTermMonths, displayMode]);

  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      if (displayMode === "years") {
        onChange(numValue * 12);
      } else {
        onChange(numValue);
      }
    }
  };

  // Increment or decrement the term
  const adjustTerm = (amount: number) => {
    if (displayMode === "years") {
      const currentYears = Math.max(1, Math.round(loanTermMonths / 12));
      const newYears = Math.max(1, currentYears + amount);
      onChange(newYears * 12);
      setInputValue(newYears.toString());
    } else {
      // In months mode, we cap at 11 months (since 12+ should show as years)
      const newMonths = Math.max(1, Math.min(11, loanTermMonths + amount));
      onChange(newMonths);
      setInputValue(newMonths.toString());
    }
  };

  // Smart toggle between years and months
  const toggleDisplayMode = () => {
    if (displayMode === "years") {
      setDisplayMode("months");
      setInputValue(loanTermMonths.toString());
    } else {
      // Only switch to years if we have enough months
      if (loanTermMonths >= 12) {
        setDisplayMode("years");
        setInputValue(Math.round(loanTermMonths / 12).toString());
      }
    }
  };

  // Get proper slider props based on current display mode
  const getSliderProps = () => {
    if (displayMode === "years") {
      return {
        min: 1,
        max: 40,
        step: 1,
        value: Math.round(loanTermMonths / 12),
        label: loanTermMonths / 12 === 1 ? 'Year' : 'Years'
      };
    } else {
      return {
        min: 1,
        max: 11, // Max 11 months (12+ becomes 1 year)
        step: 1,
        value: loanTermMonths,
        label: loanTermMonths === 1 ? 'Month' : 'Months'
      };
    }
  };

  const sliderProps = getSliderProps();

  // Auto-adjust display mode if value crosses threshold
  const handleSliderChange = (value: number[]) => {
    if (displayMode === "years") {
      onChange(value[0] * 12);
      setInputValue(value[0].toString());
    } else {
      onChange(value[0]);
      setInputValue(value[0].toString());
      
      // Auto switch to years if user slides to 12+ months
      if (value[0] >= 12 && displayMode === "months") {
        setDisplayMode("years");
        setInputValue("1");
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="loanTerm" className="text-sm font-medium flex items-center gap-1 sm:text-base">
          Loan Term
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help sm:h-4 sm:w-4" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs sm:text-sm">Length of the loan</p>
            </TooltipContent>
          </Tooltip>
        </Label>
        
        {/* Toggle button between years/months */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleDisplayMode} 
          className="h-6 px-2 text-xs text-primary sm:text-sm"
          disabled={loanTermMonths < 12 && displayMode === "months"}
        >
          {displayMode === "years" ? "Show in months" : "Show in years"}
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0 rounded-full sm:h-10 sm:w-10"
          onClick={() => adjustTerm(-1)}
        >
          <MinusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        
        <div className="relative flex-1">
          <Input
            id="termInput"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="h-10 text-center font-medium text-primary sm:h-12 sm:text-lg"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {displayMode}
          </span>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0 rounded-full sm:h-10 sm:w-10"
          onClick={() => adjustTerm(1)}
        >
          <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
      
      <Slider
        id="loanTerm"
        value={[sliderProps.value]}
        max={sliderProps.max}
        min={sliderProps.min}
        step={sliderProps.step}
        onValueChange={handleSliderChange}
        className="input-transition py-2"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{sliderProps.min} {sliderProps.label}</span>
        <span>{sliderProps.max} {sliderProps.label}</span>
      </div>
    </div>
  );
};

export default LoanTermInput;
