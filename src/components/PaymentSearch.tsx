import React from 'react';
import { Input } from "@/components/ui/input";
import { SearchIcon } from 'lucide-react';
import styles from './PaymentSearch.module.css';

interface PaymentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PaymentSearch: React.FC<PaymentSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchIcon className={styles.searchIcon} />
        <Input
          type="text"
          placeholder="   Tìm kỳ hạn..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.input}
        />
      </div>
    </div>
  );
};

export default PaymentSearch;
