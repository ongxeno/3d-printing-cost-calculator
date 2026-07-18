import React, { useState } from 'react';
import { Receipt, ChevronDown, ChevronUp } from 'lucide-react';

interface ItemizedReceiptSidebarProps {
  computed: any;
}

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);

export const ItemizedReceiptSidebar: React.FC<ItemizedReceiptSidebarProps> = ({ computed }) => {
  const [isWearExpanded, setIsWearExpanded] = useState(false);

  return (
    <div className="glass-card p-6 sticky top-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
        <div className="p-3 bg-primary/20 rounded-xl text-primary">
          <Receipt size={28} />
        </div>
        <div>
          <h2 className="text-sm font-medium text-text-muted m-0 uppercase tracking-wider">Grand Total</h2>
          <div className="text-3xl font-bold text-text-h font-mono tracking-tight text-primary">
            {formatCurrency(computed.grandTotal)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Material Cost */}
        <div className="flex justify-between items-start">
          <div>
            <span className="text-text font-medium">Material Cost</span>
            {Object.entries(computed.materialsByRole).map(([role, cost]) => (
              <div key={role} className="text-xs text-text-muted mt-1 ml-2 flex justify-between w-32">
                <span>{role}:</span>
                <span className="font-mono">{formatCurrency(cost as number)}</span>
              </div>
            ))}
          </div>
          <span className="font-mono font-medium">{formatCurrency(computed.materialCost)}</span>
        </div>

        {/* Energy Cost */}
        <div className="flex justify-between items-center">
          <span className="text-text font-medium">Energy Cost</span>
          <span className="font-mono font-medium">{formatCurrency(computed.energyCost)}</span>
        </div>

        {/* Labor Cost */}
        <div className="flex justify-between items-center">
          <span className="text-text font-medium">Labor Cost</span>
          <span className="font-mono font-medium">{formatCurrency(computed.laborCost)}</span>
        </div>

        {/* Base Depreciation */}
        <div className="flex justify-between items-center">
          <span className="text-text font-medium">Hardware Deprec.</span>
          <span className="font-mono font-medium">{formatCurrency(computed.baseHardwareDepreciation)}</span>
        </div>

        {/* Component Wear */}
        <div className="border border-border rounded-lg overflow-hidden">
          <button 
            onClick={() => setIsWearExpanded(!isWearExpanded)}
            className="w-full flex justify-between items-center p-3 bg-surface hover:bg-surface-hover transition-colors"
          >
            <span className="text-text font-medium text-sm">Maintenance Wear</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">{formatCurrency(computed.totalComponentWear)}</span>
              {isWearExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>
          
          {isWearExpanded && (
            <div className="p-3 bg-[#0f1115] max-h-48 overflow-y-auto space-y-2 border-t border-border">
              {computed.componentWearDetails.map((detail: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-text-muted truncate mr-2" title={detail.name}>{detail.name}</span>
                  <span className="font-mono text-text">{formatCurrency(detail.cost)}</span>
                </div>
              ))}
              {computed.componentWearDetails.length === 0 && (
                <div className="text-xs text-text-muted text-center py-2">No maintenance components</div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border/50 pt-4 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-text font-medium">Base Cost</span>
            <span className="font-mono font-medium">{formatCurrency(computed.baseCost)}</span>
          </div>
        </div>

        {/* Risk Buffer */}
        <div className="flex justify-between items-center text-orange-400">
          <span className="font-medium">Failure Risk Buffer</span>
          <span className="font-mono font-medium">+{formatCurrency(computed.failureBufferCost)}</span>
        </div>
      </div>
    </div>
  );
};
