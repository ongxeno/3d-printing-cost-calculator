import React, { useId, useState } from 'react';
import { Copy, FolderOpen, Pencil, Save, Trash2 } from 'lucide-react';
import type { CalculatorState } from '../utils/formulas';
import { computeCosts } from '../utils/formulas';
import type { SavedJob } from '../utils/savedJobs';

interface SavedJobsCardProps {
  jobs: SavedJob[];
  currentState: CalculatorState;
  onSave: (name: string) => void;
  onLoad: (state: CalculatorState) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);

export const SavedJobsCard: React.FC<SavedJobsCardProps> = ({
  jobs,
  onSave,
  onLoad,
  onRename,
  onDelete,
  onDuplicate
}) => {
  const [name, setName] = useState('');
  const inputId = useId();

  const handleSave = () => {
    onSave(name);
    setName('');
  };

  const handleRename = (job: SavedJob) => {
    const next = window.prompt('Rename job', job.name);
    if (next !== null && next.trim() !== '') {
      onRename(job.id, next);
    }
  };

  const handleDelete = (job: SavedJob) => {
    if (window.confirm(`Delete "${job.name}"?`)) {
      onDelete(job.id);
    }
  };

  return (
    <div className="glass-card p-6 animate-slide-down" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
          <FolderOpen size={24} />
        </div>
        <h2 className="text-xl font-semibold m-0">Saved Jobs</h2>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 mb-6">
        <div className="flex-1">
          <label htmlFor={inputId} className="label-text">Job name</label>
          <input
            id={inputId}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Job name"
            className="input-field"
          />
        </div>
        <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-2 whitespace-nowrap">
          <Save size={16} /> Save current job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-6 text-text-muted text-sm border border-dashed border-border rounded-lg">
          No saved jobs yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map(job => (
            <div key={job.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-border rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{job.name}</div>
                <div className="text-xs text-text-muted">{new Date(job.savedAt).toLocaleString()}</div>
              </div>
              <div className="font-mono text-sm whitespace-nowrap">
                {formatCurrency(computeCosts(job.state).grandTotal)}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onLoad(job.state)} aria-label="Load" title="Load" className="btn-icon">
                  <FolderOpen size={16} />
                </button>
                <button onClick={() => onDuplicate(job.id)} aria-label="Duplicate" title="Duplicate" className="btn-icon">
                  <Copy size={16} />
                </button>
                <button onClick={() => handleRename(job)} aria-label="Rename" title="Rename" className="btn-icon">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(job)} aria-label="Delete" title="Delete" className="btn-icon">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
