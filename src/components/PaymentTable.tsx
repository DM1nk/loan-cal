
import React, { useState } from 'react';
import { PaymentDetail, formatCurrency } from '../utils/loanCalculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';

interface PaymentTableProps {
  data: PaymentDetail[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Fixed value now, removed state setter
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState<"period" | "all">("all");

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64">No data to display</div>;
  }

  // Filter the data
  const filteredData = data.filter(item => {
    if (!filterValue) return true;
    
    const searchTerm = filterValue.toLowerCase();
    if (filterType === "period") {
      return item.period.toString().includes(searchTerm);
    }
    
    // Search all fields
    return (
      item.period.toString().includes(searchTerm) ||
      item.payment.toString().includes(searchTerm) ||
      item.principal.toString().includes(searchTerm) ||
      item.interest.toString().includes(searchTerm) ||
      item.remainingBalance.toString().includes(searchTerm)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  return (
    <div className="w-full animate-fade-in overflow-auto">
      <div className="p-4 mb-4">
        <h3 className="text-lg font-medium text-center">Amortization Schedule</h3>
        <p className="text-sm text-center text-muted-foreground">
          Detailed payment schedule for your loan
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as "period" | "all")}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="period">Period</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-center">Period</TableHead>
              <TableHead className="text-center">Payment</TableHead>
              <TableHead className="text-center">Interest</TableHead>
              <TableHead className="text-center">Principal</TableHead>
              <TableHead className="text-center">Remaining Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.period} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-center font-medium">
                  {item.period}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.payment)}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.interest)}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.principal)}
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.remainingBalance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
