
import React from 'react';
import LoanCalculator from '../components/LoanCalculator';
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen py-4 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-4 sm:mb-12 animate-slide-down">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 sm:mb-4 tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 bg-clip-text text-transparent">
            Loan Calculator
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your loan payments with different repayment methods
          </p>
          
          {!isMobile && (
            <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Mortgage Loans
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Auto Loans
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Personal Loans
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Student Loans
              </span>
            </div>
          )}
        </div>
        
        <LoanCalculator />
        
        <div className="mt-4 sm:mt-16 text-center text-xs sm:text-sm text-muted-foreground animate-fade-in">
          <p className="mb-2">This calculator provides estimates for informational purposes only.</p>
          <p>Actual loan terms and payments may vary based on lender policies and your financial situation.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
