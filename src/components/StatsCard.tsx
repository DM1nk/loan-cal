
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value }) => {
  return (
    <Card className="p-6 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-0 flex flex-col items-center justify-center">
        <div className="mb-2">
          <Icon className="h-10 w-10 text-primary/80 mb-1" />
        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
