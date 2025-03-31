
import React from 'react';
import { Input } from "@/components/ui/input";
import { SearchIcon } from 'lucide-react';

interface PaymentSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const PaymentSearch: React.FC<PaymentSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-4 px-4 flex items-center">
      <div className="relative w-full max-w-[200px]">
        <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Tìm kỳ hạn..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default PaymentSearch;
