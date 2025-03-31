
import React, { useState } from 'react';
import { PaymentDetail, formatCurrency } from '../utils/loanCalculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";

interface PaymentTableProps {
  data: PaymentDetail[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Fixed value
  const [filterValue, setFilterValue] = useState("");
  const [filterType, setFilterType] = useState<"period" | "all">("all");
  const isMobile = useIsMobile();

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64">Không có dữ liệu để hiển thị</div>;
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
      <div className="p-2 sm:p-4 mb-2 sm:mb-4">
        <h3 className="text-base sm:text-lg font-medium text-center">Lịch Trả Nợ</h3>
        <p className="text-xs sm:text-sm text-center text-muted-foreground">
          Lịch thanh toán chi tiết cho khoản vay của bạn
        </p>
      </div>

      <div className="flex flex-col gap-2 mb-3 sm:mb-4">
        <div className="relative w-full">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-7 sm:pl-9 h-8 sm:h-10 text-xs sm:text-sm"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        
        <Select
          value={filterType}
          onValueChange={(value) => setFilterType(value as "period" | "all")}
        >
          <SelectTrigger className="h-8 sm:h-10 text-xs sm:text-sm w-full">
            <SelectValue placeholder="Lọc theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất Cả Trường</SelectItem>
            <SelectItem value="period">Chỉ Kỳ Hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="text-center text-xs sm:text-sm py-2 px-1 sm:px-4">Kỳ</TableHead>
              <TableHead className="text-center text-xs sm:text-sm py-2 px-1 sm:px-4">Thanh Toán</TableHead>
              <TableHead className="text-center text-xs sm:text-sm py-2 px-1 sm:px-4">Lãi</TableHead>
              <TableHead className="text-center text-xs sm:text-sm py-2 px-1 sm:px-4">Gốc</TableHead>
              <TableHead className="text-center text-xs sm:text-sm py-2 px-1 sm:px-4">Dư Nợ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.period} className="hover:bg-muted/30 transition-colors">
                <TableCell className="text-center font-medium text-xs sm:text-sm py-1.5 px-1 sm:px-4">
                  {item.period}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm py-1.5 px-1 sm:px-4">
                  {formatCurrency(item.payment)}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm py-1.5 px-1 sm:px-4">
                  {formatCurrency(item.interest)}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm py-1.5 px-1 sm:px-4">
                  {formatCurrency(item.principal)}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm py-1.5 px-1 sm:px-4">
                  {isMobile ? 
                    formatCurrency(item.remainingBalance, true) : 
                    formatCurrency(item.remainingBalance)
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 gap-2">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            {isMobile ? 
              `${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredData.length)} / ${filteredData.length}` :
              `Hiển thị ${startIndex + 1} đến ${Math.min(startIndex + itemsPerPage, filteredData.length)} trong tổng số ${filteredData.length} mục`
            }
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
            >
              <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
