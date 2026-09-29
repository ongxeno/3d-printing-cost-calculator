import React from 'react';
import type { CalculatorState, JobMaterial } from '../utils/formulas';
import type { FilamentPreset } from '../data/seedData';
import { isCustomId } from '../utils/profiles';
import { InputField } from './InputField';
import { Clock, Plus, Trash2, Layers } from 'lucide-react';

interface JobDetailsCardProps {
  printTimeHours: number;
  printTimeMins: number;
  quantity: number;
  jobMaterials: JobMaterial[];
  updateState: (updates: Partial<CalculatorState>) => void;
  addJobMaterial: () => void;
  updateJobMaterial: (id: string, updates: Partial<JobMaterial>) => void;
  removeJobMaterial: (id: string) => void;
  filaments: Record<string, FilamentPreset>;
  onSaveCustomFilament: (mat: JobMaterial, name: string) => void;
  onDeleteCustomFilament: (id: string) => void;
}

const roles = ['Part', 'Support Base', 'Support Interface', 'Prime Tower'];

const secondaryBtn = 'text-xs px-3 py-1.5 rounded-md border border-border bg-surface-hover/50 text-text-muted hover:text-text hover:border-primary/40 transition-colors';

export const JobDetailsCard: React.FC<JobDetailsCardProps> = ({
  printTimeHours,
  printTimeMins,
  quantity,
  jobMaterials,
  updateState,
  addJobMaterial,
  updateJobMaterial,
  removeJobMaterial,
  filaments,
  onSaveCustomFilament,
  onDeleteCustomFilament
}) => {
  const builtInFilaments = Object.values(filaments).filter(fil => !isCustomId(fil.id));
  const customFilaments = Object.values(filaments).filter(fil => isCustomId(fil.id));

  const handleSaveCustomFilament = (mat: JobMaterial) => {
    const currentName = filaments[mat.filamentId]?.name ?? mat.filamentId;
    const name = window.prompt('Name for the custom filament', `${currentName} (custom)`);
    if (name && name.trim()) onSaveCustomFilament(mat, name);
  };

  const handleDeleteCustomFilament = (mat: JobMaterial) => {
    if (window.confirm('Delete this custom filament?')) {
      onDeleteCustomFilament(mat.filamentId);
    }
  };

  return (
    <div className="glass-card p-6 animate-slide-down" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/20 rounded-lg text-accent">
          <Clock size={24} />
        </div>
        <h2 className="text-xl font-semibold m-0">Job Details</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <InputField
          label="Print Time (Hours)"
          value={printTimeHours}
          onChange={(val) => updateState({ printTimeHours: val })}
          suffix="hrs"
        />
        <InputField
          label="Print Time (Mins)"
          value={printTimeMins}
          onChange={(val) => updateState({ printTimeMins: val })}
          suffix="mins"
        />
        <InputField
          label="Quantity (units on plate)"
          value={quantity}
          min={1}
          onChange={(val) => updateState({ quantity: Math.max(1, Math.floor(val)) })}
          suffix="pcs"
        />
      </div>

      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-text-muted">
            <Layers size={18} />
            <h3 className="font-medium m-0">Materials Used</h3>
          </div>
          <button onClick={addJobMaterial} className="btn-primary text-sm py-1.5 flex items-center gap-1">
            <Plus size={16} /> Add Material
          </button>
        </div>

        <div className="space-y-3">
          {jobMaterials.map(mat => (
            <div key={mat.id} className="flex flex-col gap-3 p-3 bg-surface rounded-lg border border-border">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label htmlFor={`${mat.id}-role`} className="label-text">Role</label>
                  <select
                    id={`${mat.id}-role`}
                    value={mat.role}
                    onChange={(e) => updateJobMaterial(mat.id, { role: e.target.value })}
                    className="input-field py-2"
                  >
                    {roles.map(r => (
                      <option key={r} value={r} className="bg-surface">{r}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label htmlFor={`${mat.id}-filament`} className="label-text">Filament Preset</label>
                  <select
                    id={`${mat.id}-filament`}
                    value={mat.filamentId}
                    onChange={(e) => updateJobMaterial(mat.id, { filamentId: e.target.value })}
                    className="input-field py-2 truncate"
                  >
                    {!(mat.filamentId in filaments) && (
                      <option value={mat.filamentId} className="bg-surface">Custom (removed)</option>
                    )}
                    <optgroup label="Built-in">
                      {builtInFilaments.map(fil => (
                        <option key={fil.id} value={fil.id} className="bg-surface">{fil.name}</option>
                      ))}
                    </optgroup>
                    {customFilaments.length > 0 && (
                      <optgroup label="Custom">
                        {customFilaments.map(fil => (
                          <option key={fil.id} value={fil.id} className="bg-surface">{fil.name}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div className="w-24">
                  <InputField
                    label="Weight"
                    value={mat.weight_g}
                    onChange={(val) => updateJobMaterial(mat.id, { weight_g: val })}
                    suffix="g"
                  />
                </div>
                <button 
                  onClick={() => removeJobMaterial(mat.id)}
                  className="btn-icon text-red-400 hover:text-red-300 hover:bg-red-400/10 mb-1"
                  title="Remove Material"
                  aria-label="Remove material"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <InputField
                    label="Price (THB/kg)"
                    value={mat.price_per_kg_thb}
                    onChange={(val) => updateJobMaterial(mat.id, { price_per_kg_thb: val })}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Power Multiplier"
                    value={mat.power_draw_multiplier}
                    onChange={(val) => updateJobMaterial(mat.id, { power_draw_multiplier: val })}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Wear Multiplier"
                    value={mat.hardware_wear_multiplier}
                    onChange={(val) => updateJobMaterial(mat.id, { hardware_wear_multiplier: val })}
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Purge Waste"
                    value={mat.waste_g}
                    onChange={(val) => updateJobMaterial(mat.id, { waste_g: val })}
                    suffix="g"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => handleSaveCustomFilament(mat)} className={secondaryBtn}>
                  Save as custom filament…
                </button>
                {isCustomId(mat.filamentId) && mat.filamentId in filaments && (
                  <button type="button" onClick={() => handleDeleteCustomFilament(mat)} className={secondaryBtn}>
                    Delete custom filament
                  </button>
                )}
              </div>
            </div>
          ))}
          {jobMaterials.length === 0 && (
            <div className="text-center py-6 text-text-muted text-sm border border-dashed border-border rounded-lg">
              No materials added. Click "Add Material" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
