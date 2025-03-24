
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
        </div>
        
        <LoanCalculator />
        
        <div className="mt-16 text-center text-sm text-muted-foreground animate-fade-in">
          <p>This calculator provides estimates for informational purposes only.</p>
          <p>Actual loan terms and payments may vary based on lender policies and your financial situation.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
