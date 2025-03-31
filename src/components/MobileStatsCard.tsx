
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MobileStatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

const MobileStatsCard: React.FC<MobileStatsCardProps> = ({ icon: Icon, title, value }) => {
  return (
    <div className="flex-1 min-w-[48%] p-2 rounded-lg bg-white/70 backdrop-blur-sm border border-gray-100 shadow-sm flex flex-col items-center">
      <Icon className="h-6 w-6 text-primary/80 mb-1" />
      <h3 className="text-xs font-medium text-gray-500">{title}</h3>
      <p className="text-base font-bold text-primary">{value}</p>
    </div>
  );
};

export default MobileStatsCard;
