import React from 'react';
import { InputField } from './InputField';
import { BadgeDollarSign, UserCog } from 'lucide-react';

interface EconomicsCardProps {
  elecRate: number;
  laborRate: number;
  prepTime: number;
  setupTime: number;
  postTime: number;
  failureRate: number;
  updateState: (updates: any) => void;
}

export const EconomicsCard: React.FC<EconomicsCardProps> = ({
  elecRate,
  laborRate,
  prepTime,
  setupTime,
  postTime,
  failureRate,
  updateState
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card p-6 animate-slide-down" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
            <BadgeDollarSign size={24} />
          </div>
          <h2 className="text-xl font-semibold m-0">Local Economics</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Electricity Rate"
            value={elecRate}
            onChange={(val) => updateState({ elecRate: val })}
            suffix="THB/kWh"
          />
          <InputField
            label="Labor Rate"
            value={laborRate}
            onChange={(val) => updateState({ laborRate: val })}
            suffix="THB/hr"
          />
        </div>
      </div>

      <div className="glass-card p-6 animate-slide-down" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <UserCog size={24} />
          </div>
          <h2 className="text-xl font-semibold m-0">Labor & Buffers</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <InputField
            label="Pre-Production"
            value={prepTime}
            onChange={(val) => updateState({ prepTime: val })}
            suffix="mins"
          />
          <InputField
            label="Setup Time"
            value={setupTime}
            onChange={(val) => updateState({ setupTime: val })}
            suffix="mins"
          />
          <InputField
            label="Post-Processing"
            value={postTime}
            onChange={(val) => updateState({ postTime: val })}
            suffix="mins"
          />
          <InputField
            label="Failure Risk Buffer"
            value={failureRate}
            onChange={(val) => updateState({ failureRate: val })}
            suffix="%"
          />
        </div>
      </div>
    </div>
  );
};
