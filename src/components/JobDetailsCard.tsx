import React from 'react';
import type { JobMaterial } from '../utils/formulas';
import { filamentPresets } from '../data/seedData';
import { InputField } from './InputField';
import { Clock, Plus, Trash2, Layers } from 'lucide-react';

interface JobDetailsCardProps {
  printTimeHours: number;
  printTimeMins: number;
  jobMaterials: JobMaterial[];
  updateState: (updates: any) => void;
  addJobMaterial: () => void;
  updateJobMaterial: (id: string, updates: Partial<JobMaterial>) => void;
  removeJobMaterial: (id: string) => void;
}

const roles = ['Part', 'Support Base', 'Support Interface', 'Prime Tower'];

export const JobDetailsCard: React.FC<JobDetailsCardProps> = ({
  printTimeHours,
  printTimeMins,
  jobMaterials,
  updateState,
  addJobMaterial,
  updateJobMaterial,
  removeJobMaterial
}) => {
  return (
    <div className="glass-card p-6 animate-slide-down" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent/20 rounded-lg text-accent">
          <Clock size={24} />
        </div>
        <h2 className="text-xl font-semibold m-0">Job Details</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
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
            <div key={mat.id} className="flex items-end gap-3 p-3 bg-surface rounded-lg border border-border">
              <div className="flex-1">
                <label className="label-text">Role</label>
                <select
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
                <label className="label-text">Filament</label>
                <select
                  value={mat.filamentId}
                  onChange={(e) => updateJobMaterial(mat.id, { filamentId: e.target.value })}
                  className="input-field py-2 truncate"
                >
                  {Object.values(filamentPresets).map(fil => (
                    <option key={fil.id} value={fil.id} className="bg-surface">{fil.name}</option>
                  ))}
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
              >
                <Trash2 size={20} />
              </button>
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
