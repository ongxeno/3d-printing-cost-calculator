import React from 'react';
import { printerProfiles } from '../data/seedData';
import { Printer } from 'lucide-react';

interface HardwareProfileCardProps {
  printerId: string;
  onChange: (id: string) => void;
}

export const HardwareProfileCard: React.FC<HardwareProfileCardProps> = ({ printerId, onChange }) => {
  return (
    <div className="glass-card p-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg text-primary">
          <Printer size={24} />
        </div>
        <h2 className="text-xl font-semibold m-0">Hardware Profile</h2>
      </div>
      
      <div className="flex flex-col">
        <label className="label-text">Select Printer</label>
        <select
          value={printerId}
          onChange={(e) => onChange(e.target.value)}
          className="input-field appearance-none cursor-pointer"
        >
          {Object.values(printerProfiles).map(printer => (
            <option key={printer.id} value={printer.id} className="bg-surface text-text">
              {printer.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
