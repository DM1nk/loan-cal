
import React from 'react';
import LoanCalculator from '../components/LoanCalculator';
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen py-4 sm:py-16 px-2 sm:px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-4 sm:mb-12 animate-slide-down">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 sm:mb-4 tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 bg-clip-text text-transparent">
            Máy Tính Khoản Vay
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Tính toán khoản thanh toán với các phương pháp trả nợ khác nhau
          </p>
          
          {!isMobile && (
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Card className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border-none shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-0">Vay Mua Nhà</CardContent>
              </Card>
              <Card className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border-none shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-0">Vay Mua Xe</CardContent>
              </Card>
              <Card className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border-none shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-0">Vay Tiêu Dùng</CardContent>
              </Card>
              <Card className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border-none shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-0">Vay Học Tập</CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <LoanCalculator />
        
        <div className="mt-4 sm:mt-16 text-center text-xs sm:text-sm text-muted-foreground animate-fade-in">
          <p className="mb-2">Máy tính này cung cấp ước tính chỉ mang tính chất tham khảo.</p>
          <p>Các điều khoản và khoản thanh toán thực tế có thể thay đổi dựa trên chính sách của người cho vay và tình hình tài chính của bạn.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
