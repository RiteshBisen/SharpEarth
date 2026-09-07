import React from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  valueDisplay?: string | number;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  valueDisplay,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className,
  ...props
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || valueDisplay !== undefined) && (
        <div className="flex justify-between items-center text-xs text-slate-700 font-medium">
          {label && <span>{label}</span>}
          {valueDisplay !== undefined && <span className="font-mono text-blue-700 font-bold">{valueDisplay}</span>}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
        {...props}
      />
    </div>
  );
};
