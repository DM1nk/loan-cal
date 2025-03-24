
import React from 'react';
import LoanCalculator from '../components/LoanCalculator';

const Index = () => {
  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12 animate-slide-down">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 bg-clip-text text-transparent">
            Loan Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your loan payments with different repayment methods and see detailed payment schedules
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Mortgage Loans
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Auto Loans
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Personal Loans
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Student Loans
            </span>
          </div>
        </div>
        
        <LoanCalculator />
        
        <div className="mt-16 text-center text-sm text-muted-foreground animate-fade-in">
          <p className="mb-2">This calculator provides estimates for informational purposes only.</p>
          <p>Actual loan terms and payments may vary based on lender policies and your financial situation.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
