import React from 'react';

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (val: number) => void;
  suffix?: string;
  min?: number;
  step?: number;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChange, 
  suffix,
  className = ''
}) => {
  // Convert value to string for the input field to prevent cursor jumping
  const displayValue = value === 0 ? '0' : value.toString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Allow empty string to mean 0 for easier clearing
    if (rawVal === '') {
      onChange(0);
      return;
    }
    
    // Parse to float, if valid
    const parsed = parseFloat(rawVal);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <label className="label-text">{label}</label>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          className="input-field pr-12"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
