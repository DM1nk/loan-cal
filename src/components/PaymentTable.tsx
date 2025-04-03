import React, { useState, useEffect } from 'react';
import { PaymentDetail, formatCurrency } from '../utils/loanCalculations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import PaymentSearch from './PaymentSearch';
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from './PaymentTable.module.css';

interface PaymentTableProps {
  data: PaymentDetail[];
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  data
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
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
    setCurrentPage(1);
  }, [searchTerm, data]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  if (!data || data.length === 0) {
    return <div className={styles.noData}>Không có dữ liệu để hiển thị</div>;
  }

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
    return (
      <div className={`${styles.pagination} ${isMobile ? '' : styles.paginationDesktop}`}>
        <div className={`${styles.paginationInfo} ${isMobile ? '' : styles.paginationInfoDesktop}`}>
          {isMobile 
            ? `${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredData.length)} / ${filteredData.length}`
            : `Hiển thị ${startIndex + 1} đến ${Math.min(startIndex + itemsPerPage, filteredData.length)} trong tổng số ${filteredData.length} mục`
          }
        </div>
        <div className={`${styles.paginationControls} ${isMobile ? '' : styles.paginationControlsDesktop}`}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => goToPage(currentPage - 1)} 
            disabled={currentPage === 1} 
            className="h-8 w-8 p-0 sm:h-9 sm:w-9"
          >
            <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className={`${styles.paginationPage} ${isMobile ? '' : styles.paginationPageDesktop}`}>
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
    );
  };

  return (
    <Card className={styles.container}>
      <CardContent className="p-0">
        <div className={isMobile ? styles.headerMobile : styles.header}>
          <h3 className={isMobile ? styles.titleMobile : styles.title}>
            Lịch Trình Trả Nợ
          </h3>
          <p className={isMobile ? styles.subtitleMobile : styles.subtitle}>
            Lịch thanh toán chi tiết cho khoản vay của bạn
          </p>
        </div>
        
        <PaymentSearch searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        
        <ScrollArea className="h-auto max-h-[60vh]">
          <div className={styles.tableContainer}>
            <Table>
              <TableHeader className={styles.tableHeader}>
                <TableRow>
                  <TableHead className={styles.tableHeaderCell}>Kỳ</TableHead>
                  <TableHead className={styles.tableHeaderCell}>Thanh Toán</TableHead>
                  <TableHead className={styles.tableHeaderCell}>Lãi</TableHead>
                  <TableHead className={styles.tableHeaderCell}>Gốc</TableHead>
                  <TableHead className={styles.tableHeaderCell}>Dư Nợ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map(item => (
                    <TableRow key={item.period} className={styles.tableRow}>
                      <TableCell className={styles.tableCell}>
                        {item.period}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {formatCurrency(item.payment, isMobile)}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {formatCurrency(item.interest, isMobile)}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {formatCurrency(item.principal, isMobile)}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        {formatCurrency(item.remainingBalance, isMobile)}
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
        </ScrollArea>

        {renderPagination()}
      </CardContent>
    </Card>
  );
};

export default PaymentTable;