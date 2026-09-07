import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-lg p-5 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:shadow-xs',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
