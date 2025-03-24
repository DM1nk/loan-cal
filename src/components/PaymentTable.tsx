
import React from 'react';
import { PaymentDetail, formatCurrency } from '../utils/loanCalculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PaymentTableProps {
  data: PaymentDetail[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64">No data to display</div>;
  }

  return (
    <div className="w-full animate-fade-in overflow-auto">
      <div className="p-4 mb-4">
        <h3 className="text-lg font-medium text-center">Amortization Schedule</h3>
        <p className="text-sm text-center text-muted-foreground">
          Detailed payment schedule for your loan
        </p>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-center">Period</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-center">Principal</TableHead>
              <TableHead className="text-center">Interest</TableHead>
              <TableHead className="text-center">Remaining Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.period} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-center font-medium">
                  {item.period}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.payment)}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.principal)}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.interest)}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.remainingBalance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PaymentTable;
