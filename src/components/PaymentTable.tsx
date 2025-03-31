
import React, { useState, useEffect } from 'react';
import { PaymentDetail, formatCurrency } from '../utils/loanCalculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";

interface PaymentTableProps {
  data: PaymentDetail[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Fixed value
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<PaymentDetail[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(data);
    } else {
      const term = searchTerm.trim();
      const filtered = data.filter(item => 
        item.period.toString().includes(term)
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, data]);

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64">Không có dữ liệu để hiển thị</div>;
  }

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
      
      <div className="mb-4 flex items-center">
        <div className="relative w-full max-w-[200px]">
          <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kỳ hạn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
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
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Không tìm thấy kỳ hạn phù hợp
                </TableCell>
              </TableRow>
            )}
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
