export type LoanType = 'fixedPrincipal' | 'fixedInterest' | 'evenDistribution';

export interface PaymentDetail {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface LoanSummary {
  totalPayment: number;
  totalInterest: number;
  monthlyPayment: number; // For fixed payment types
  paymentSchedule: PaymentDetail[];
}

export function calculateLoan(
  loanAmount: number,
  interestRate: number,
  loanTerm: number,
  loanType: LoanType
): LoanSummary {
  // Convert annual interest rate to monthly rate
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = loanTerm * 12;
  
  let paymentSchedule: PaymentDetail[] = [];
  let totalPayment = 0;
  let totalInterest = 0;
  let monthlyPayment = 0;
  
  let remainingBalance = loanAmount;
  
  switch(loanType) {
    case 'fixedPrincipal':
      // Fixed principal payment (principal is constant, interest varies)
      const fixedPrincipal = loanAmount / totalMonths;
      
      for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const payment = fixedPrincipal + interestPayment;
        
        totalPayment += payment;
        totalInterest += interestPayment;
        
        remainingBalance -= fixedPrincipal;
        
        paymentSchedule.push({
          period: month,
          payment: payment,
          principal: fixedPrincipal,
          interest: interestPayment,
          remainingBalance: remainingBalance
        });
      }
      
      monthlyPayment = paymentSchedule[0].payment; // First month's payment
      break;
      
    case 'evenDistribution':
      // Even distribution (equal payments) - amortized loan
      // Formula: P = (PV * r * (1 + r)^n) / ((1 + r)^n - 1)
      if (monthlyRate === 0) {
        // Handle edge case: 0% interest
        monthlyPayment = loanAmount / totalMonths;
      } else {
        monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                        (Math.pow(1 + monthlyRate, totalMonths) - 1);
      }
      
      for (let month = 1; month <= totalMonths; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        totalPayment += monthlyPayment;
        totalInterest += interestPayment;
        
        remainingBalance -= principalPayment;
        // Ensure we don't end up with tiny floating point values
        if (month === totalMonths) remainingBalance = 0;
        
        paymentSchedule.push({
          period: month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: remainingBalance
        });
      }
      break;
      
    case 'fixedInterest':
      // Fixed interest (interest is constant, principal varies)
      const totalInterestAmount = loanAmount * monthlyRate * totalMonths;
      const fixedInterestPayment = totalInterestAmount / totalMonths;
      const principalPayment = loanAmount / totalMonths;
      monthlyPayment = principalPayment + fixedInterestPayment;
      
      for (let month = 1; month <= totalMonths; month++) {
        const payment = principalPayment + fixedInterestPayment;
        
        totalPayment += payment;
        totalInterest += fixedInterestPayment;
        
        remainingBalance -= principalPayment;
        
        paymentSchedule.push({
          period: month,
          payment: payment,
          principal: principalPayment,
          interest: fixedInterestPayment,
          remainingBalance: remainingBalance
        });
      }
      break;
  }
  
  return {
    totalPayment,
    totalInterest,
    monthlyPayment,
    paymentSchedule
  };
}

// Add a new optional parameter to format currency that's more mobile-friendly
export const formatCurrency = (value: number | string, compact: boolean = false): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numericValue)) {
    return '$0.00';
  }

  // For mobile view, use a more compact format for large numbers
  if (compact && numericValue >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(numericValue);
  }
  
  // Standard format for desktop or smaller numbers
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numericValue);
};
