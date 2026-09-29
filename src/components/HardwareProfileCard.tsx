import React from 'react';
import type { PrinterProfile } from '../data/seedData';
import { isCustomId } from '../utils/profiles';
import { Printer } from 'lucide-react';

interface HardwareProfileCardProps {
  printerId: string;
  onChange: (id: string) => void;
  printers: Record<string, PrinterProfile>;
  onSaveCustomPrinter: (name: string) => void;
  onUpdateCustomPrinter: () => void;
  onDeleteCustomPrinter: () => void;
}

const secondaryBtn = 'text-xs px-3 py-1.5 rounded-md border border-border bg-surface-hover/50 text-text-muted hover:text-text hover:border-primary/40 transition-colors';

export const HardwareProfileCard: React.FC<HardwareProfileCardProps> = ({
  printerId,
  onChange,
  printers,
  onSaveCustomPrinter,
  onUpdateCustomPrinter,
  onDeleteCustomPrinter
}) => {
  const builtIn = Object.values(printers).filter(p => !isCustomId(p.id));
  const custom = Object.values(printers).filter(p => isCustomId(p.id));
  const currentName = printers[printerId]?.name ?? printerId;
  const selectedIsCustom = isCustomId(printerId);

  const handleSave = () => {
    const name = window.prompt('Name for the custom printer', `${currentName} (custom)`);
    if (name && name.trim()) onSaveCustomPrinter(name);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this custom printer? The calculator will switch to the default printer.')) {
      onDeleteCustomPrinter();
    }
  };

  return (
    <div className="glass-card p-6 animate-slide-down" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/20 rounded-lg text-primary">
          <Printer size={24} />
        </div>
        <h2 className="text-xl font-semibold m-0">Hardware Profile</h2>
      </div>

      <div className="flex flex-col">
        <label htmlFor="printer-select" className="label-text">Select Printer</label>
        <select
          id="printer-select"
          value={printerId}
          onChange={(e) => onChange(e.target.value)}
          className="input-field appearance-none cursor-pointer"
        >
          <optgroup label="Built-in">
            {builtIn.map(printer => (
              <option key={printer.id} value={printer.id} className="bg-surface text-text">
                {printer.name}
              </option>
            ))}
          </optgroup>
          {custom.length > 0 && (
            <optgroup label="Custom">
              {custom.map(printer => (
                <option key={printer.id} value={printer.id} className="bg-surface text-text">
                  {printer.name}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <div className="flex flex-wrap gap-2 mt-3">
          <button type="button" onClick={handleSave} className={secondaryBtn}>
            Save as custom printer…
          </button>
          {selectedIsCustom && (
            <button type="button" onClick={onUpdateCustomPrinter} className={secondaryBtn}>
              Update this profile
            </button>
          )}
          {selectedIsCustom && (
            <button type="button" onClick={handleDelete} className={secondaryBtn}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
