import React from 'react';
import LoanCalculator from '../components/LoanCalculator';
import { useIsMobile } from "@/hooks/use-mobile";
import CategoryPill from '@/components/CategoryPill';
const Index = () => {
  const isMobile = useIsMobile();
  const categories = [{
    text: "Vay Mua Nhà",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800"
  }, {
    text: "Vay Mua Xe",
    bgColor: "bg-green-100",
    textColor: "text-green-800"
  }, {
    text: "Vay Tiêu Dùng",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800"
  }, {
    text: "Vay Học Tập",
    bgColor: "bg-amber-100",
    textColor: "text-amber-800"
  }];
  return <div className="min-h-screen py-4 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-4 sm:mb-12 animate-slide-down">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 sm:mb-4 tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 bg-clip-text text-transparent">Công Cụ Tính Khoản Vay</h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">Tính toán khoản lãi suất khoản vay và lịch trình thanh toán </p>
          
          {!isMobile && <div className="flex flex-wrap justify-center gap-3 mt-6">
              {categories.map((category, index) => <CategoryPill key={index} text={category.text} bgColor={category.bgColor} textColor={category.textColor} />)}
            </div>}
        </div>
        
        <LoanCalculator />
        
        <div className="mt-4 sm:mt-16 text-center text-xs sm:text-sm text-muted-foreground animate-fade-in">
          
          
        </div>
      </div>
    </div>;
};
export default Index;