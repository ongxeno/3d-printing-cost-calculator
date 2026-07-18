import React from 'react';
import { InputField } from './InputField';
import type { MaintenanceComponent } from '../data/seedData';
import { Settings, Plus, Trash2, Wrench } from 'lucide-react';

interface AdvancedVariablesCardProps {
  printerPrice: number;
  printerLifespan: number;
  effectiveDrawWatts: number;
  maintenanceParts: MaintenanceComponent[];
  updateState: (updates: any) => void;
  addMaintenancePart: () => void;
  updateMaintenancePart: (id: string, updates: Partial<MaintenanceComponent>) => void;
  removeMaintenancePart: (id: string) => void;
}

export const AdvancedVariablesCard: React.FC<AdvancedVariablesCardProps> = ({
  printerPrice,
  printerLifespan,
  effectiveDrawWatts,
  maintenanceParts,
  updateState,
  addMaintenancePart,
  updateMaintenancePart,
  removeMaintenancePart
}) => {
  return (
    <div className="glass-card p-6 animate-slide-down" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
            <Settings size={24} />
          </div>
          <h2 className="text-xl font-semibold m-0">Advanced Engine Variables</h2>
        </div>
        <div className="bg-surface px-4 py-2 rounded-lg border border-border flex items-center gap-2">
          <span className="text-sm text-text-muted">Effective Draw:</span>
          <span className="font-mono font-semibold text-orange-400">{effectiveDrawWatts.toFixed(1)}W</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <InputField
          label="Printer Purchase Price"
          value={printerPrice}
          onChange={(val) => updateState({ printerPrice: val })}
          suffix="THB"
        />
        <InputField
          label="Base Lifespan"
          value={printerLifespan}
          onChange={(val) => updateState({ printerLifespan: val })}
          suffix="hrs"
        />
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Wrench size={18} />
            <h3 className="font-medium m-0">Maintenance Parts</h3>
          </div>
          <button onClick={addMaintenancePart} className="btn-primary text-sm py-1.5 flex items-center gap-1 bg-surface hover:bg-surface-hover border border-border text-text shadow-none">
            <Plus size={16} /> Add Part
          </button>
        </div>

        <div className="space-y-4">
          {maintenanceParts.map(part => (
            <div key={part.id} className="p-4 bg-surface rounded-lg border border-border flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="label-text">Part Name</label>
                  <input
                    type="text"
                    value={part.name}
                    onChange={(e) => updateMaintenancePart(part.id, { name: e.target.value })}
                    className="input-field py-1.5"
                  />
                </div>
                <button 
                  onClick={() => removeMaintenancePart(part.id)}
                  className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-400/10 mt-6"
                  title="Remove Part"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <InputField
                  label="Replacement Cost"
                  value={part.replacement_cost_thb}
                  onChange={(val) => updateMaintenancePart(part.id, { replacement_cost_thb: val })}
                  suffix="THB"
                />
                <InputField
                  label="Repl. Lifespan"
                  value={part.replacement_lifespan_hours}
                  onChange={(val) => updateMaintenancePart(part.id, { replacement_lifespan_hours: val })}
                  suffix="hrs"
                />
                <InputField
                  label="Periodic Cost"
                  value={part.periodic_maintenance_cost_thb}
                  onChange={(val) => updateMaintenancePart(part.id, { periodic_maintenance_cost_thb: val })}
                  suffix="THB"
                />
                <InputField
                  label="Periodic Interval"
                  value={part.periodic_maintenance_interval_hours}
                  onChange={(val) => updateMaintenancePart(part.id, { periodic_maintenance_interval_hours: val })}
                  suffix="hrs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
