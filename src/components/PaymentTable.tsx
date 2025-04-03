import React, { useState, useEffect } from 'react';
import { PaymentDetail, formatCurrency } from '../utils/loanCalculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import PaymentSearch from './PaymentSearch';
import { ScrollArea } from "@/components/ui/scroll-area";
interface PaymentTableProps {
  data: PaymentDetail[];
}
const PaymentTable: React.FC<PaymentTableProps> = ({
  data
}) => {
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
      const filtered = data.filter(item => item.period.toString().includes(term));
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, data]);
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-64">Không có dữ liệu để hiển thị</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 gap-2">
        <div className="text-xs text-muted-foreground text-center sm:text-left">
          {isMobile ? `${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredData.length)} / ${filteredData.length}` : `Hiển thị ${startIndex + 1} đến ${Math.min(startIndex + itemsPerPage, filteredData.length)} trong tổng số ${filteredData.length} mục`}
        </div>
        <div className="flex items-center justify-center sm:justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-8 w-8 p-0 sm:h-9 sm:w-9">
            <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="text-xs sm:text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-8 w-8 p-0 sm:h-9 sm:w-9">
            <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>;
  };
  return <Card className="w-full animate-fade-in">
      <CardContent className="p-0">
        <div className="p-2 sm:p-4 mb-2 sm:mb-4">
          <h3 className="text-base sm:text-lg font-medium text-center">Lịch Trình Trả Nợ</h3>
          <p className="text-xs sm:text-sm text-center text-muted-foreground">
            Lịch thanh toán chi tiết cho khoản vay của bạn
          </p>
        </div>
        
        <PaymentSearch searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        
        <ScrollArea className="h-auto max-h-[60vh]">
          <div className="border rounded-md">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-center w-[15%] text-xs py-1.5 px-1">Kỳ</TableHead>
                  <TableHead className="text-center w-[21.25%] text-xs py-1.5 px-1">Thanh Toán</TableHead>
                  <TableHead className="text-center w-[21.25%] text-xs py-1.5 px-1">Lãi</TableHead>
                  <TableHead className="text-center w-[21.25%] text-xs py-1.5 px-1">Gốc</TableHead>
                  <TableHead className="text-center w-[21.25%] text-xs py-1.5 px-1">Dư Nợ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? paginatedData.map(item => <TableRow key={item.period} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-center font-medium text-xs py-1 px-0.5">
                        {item.period}
                      </TableCell>
                      <TableCell className="text-center text-xs py-1 px-0.5">
                        {formatCurrency(item.payment, isMobile)}
                      </TableCell>
                      <TableCell className="text-center text-xs py-1 px-0.5">
                        {formatCurrency(item.interest, isMobile)}
                      </TableCell>
                      <TableCell className="text-center text-xs py-1 px-0.5">
                        {formatCurrency(item.principal, isMobile)}
                      </TableCell>
                      <TableCell className="text-center text-xs py-1 px-0.5">
                        {formatCurrency(item.remainingBalance, isMobile)}
                      </TableCell>
                    </TableRow>) : <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Không tìm thấy kỳ hạn phù hợp
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>

        {renderPagination()}
      </CardContent>
    </Card>;
};
export default PaymentTable;