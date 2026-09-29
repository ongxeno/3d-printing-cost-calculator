import React, { useId } from 'react';
import { clampValue } from '../utils/clamp';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (val: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  hint?: string;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  suffix,
  min = 0,
  max,
  hint,
  className = ''
}) => {
  const id = useId();
  // Convert value to string for the input field to prevent cursor jumping
  const displayValue = value === 0 ? '0' : value.toString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Allow empty string to mean 0 for easier clearing
    if (rawVal === '') {
      onChange(clampValue(0, min, max));
      return;
    }
    
    // Parse to float, if valid
    const parsed = parseFloat(rawVal);
    if (Number.isFinite(parsed)) {
      onChange(clampValue(parsed, min, max));
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="label-text">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className="input-field pr-12"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-orange-400 mt-1">{hint}</p>
      )}
    </div>
  );
};
