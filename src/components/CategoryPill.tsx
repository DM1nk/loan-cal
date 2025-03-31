
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface CategoryPillProps {
  text: string;
  bgColor: string;
  textColor: string;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ text, bgColor, textColor }) => {
  return (
    <Card className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${bgColor} ${textColor} border-none shadow-sm hover:shadow-md transition-all duration-200`}>
      <CardContent className="p-0">{text}</CardContent>
    </Card>
  );
};

export default CategoryPill;
