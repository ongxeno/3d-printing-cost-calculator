
import { useCalculatorState } from './hooks/useCalculatorState';
import { HardwareProfileCard } from './components/HardwareProfileCard';
import { JobDetailsCard } from './components/JobDetailsCard';
import { EconomicsCard } from './components/EconomicsCard';
import { AdvancedVariablesCard } from './components/AdvancedVariablesCard';
import { ItemizedReceiptSidebar } from './components/ItemizedReceiptSidebar';
import { Calculator } from 'lucide-react';

function App() {
  const {
    state,
    setPrinterId,
    updateState,
    addJobMaterial,
    updateJobMaterial,
    removeJobMaterial,
    addMaintenancePart,
    updateMaintenancePart,
    removeMaintenancePart,
    computed
  } = useCalculatorState();

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center lg:text-left flex items-center justify-center lg:justify-start gap-4 animate-slide-down">
          <div className="p-3 bg-primary rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Calculator size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-text-h tracking-tight m-0 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              TrueCost Calculator
            </h1>
            <p className="text-text-muted mt-1">Granular FDM 3D printing cost analysis</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Data Entry (8/12) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <HardwareProfileCard 
              printerId={state.printerId} 
              onChange={setPrinterId} 
            />
            
            <JobDetailsCard 
              printTimeHours={state.printTimeHours}
              printTimeMins={state.printTimeMins}
              jobMaterials={state.jobMaterials}
              updateState={updateState}
              addJobMaterial={addJobMaterial}
              updateJobMaterial={updateJobMaterial}
              removeJobMaterial={removeJobMaterial}
            />

            <EconomicsCard 
              elecRate={state.elecRate}
              laborRate={state.laborRate}
              prepTime={state.prepTime}
              setupTime={state.setupTime}
              postTime={state.postTime}
              failureRate={state.failureRate}
              updateState={updateState}
            />

            <AdvancedVariablesCard 
              printerPrice={state.printerPrice}
              printerLifespan={state.printerLifespan}
              effectiveDrawWatts={computed.effectiveDrawWatts}
              maintenanceParts={state.maintenanceParts}
              updateState={updateState}
              addMaintenancePart={addMaintenancePart}
              updateMaintenancePart={updateMaintenancePart}
              removeMaintenancePart={removeMaintenancePart}
            />
          </div>

          {/* Right Column: Itemized Receipt (4/12) */}
          <div className="lg:col-span-4 relative">
            <ItemizedReceiptSidebar computed={computed} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
