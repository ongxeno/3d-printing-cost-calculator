
import { useCalculatorState } from './hooks/useCalculatorState';
import { useCustomProfiles } from './hooks/useCustomProfiles';
import { useSavedJobs } from './hooks/useSavedJobs';
import { isCustomId } from './utils/profiles';
import type { JobMaterial } from './utils/formulas';
import { HardwareProfileCard } from './components/HardwareProfileCard';
import { JobDetailsCard } from './components/JobDetailsCard';
import { EconomicsCard } from './components/EconomicsCard';
import { AdvancedVariablesCard } from './components/AdvancedVariablesCard';
import { SavedJobsCard } from './components/SavedJobsCard';
import { ItemizedReceiptSidebar } from './components/ItemizedReceiptSidebar';
import { Calculator, RotateCcw } from 'lucide-react';

function App() {
  const profiles = useCustomProfiles();
  const savedJobs = useSavedJobs(profiles.catalog);
  const {
    state,
    resetState,
    replaceState,
    setPrinterId,
    updateState,
    addJobMaterial,
    updateJobMaterial,
    removeJobMaterial,
    addMaintenancePart,
    updateMaintenancePart,
    removeMaintenancePart,
    computed
  } = useCalculatorState(profiles.catalog);

  const catalog = profiles.catalog;

  const printerValues = () => ({
    purchase_price_thb: state.printerPrice,
    estimated_lifespan_hours: state.printerLifespan,
    base_power_draw_watts: state.basePowerDraw,
    supports_multi_color: catalog.printers[state.printerId]?.supports_multi_color ?? false,
    maintenance_components: state.maintenanceParts
  });

  const handleSaveCustomPrinter = (name: string) => {
    const id = profiles.savePrinter(name, printerValues());
    updateState({ printerId: id });
  };

  const handleUpdateCustomPrinter = () => {
    const printer = catalog.printers[state.printerId];
    if (!printer || !isCustomId(printer.id)) return;
    profiles.savePrinter(printer.name, printerValues(), state.printerId);
  };

  const handleDeleteCustomPrinter = () => {
    profiles.deletePrinter(state.printerId);
    setPrinterId('bambu_x2d_combo');
  };

  const handleSaveCustomFilament = (mat: JobMaterial, name: string) => {
    const id = profiles.saveFilament(name, {
      price_per_kg_thb: mat.price_per_kg_thb,
      power_draw_multiplier: mat.power_draw_multiplier,
      hardware_wear_multiplier: mat.hardware_wear_multiplier
    });
    updateJobMaterial(mat.id, { filamentId: id });
  };

  const handleDeleteCustomFilament = (id: string) => {
    profiles.deleteFilament(id);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row items-center gap-4 animate-slide-down">
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="p-3 bg-primary rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.3)] flex-shrink-0">
              <Calculator size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-h tracking-tight m-0 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                TrueCost Calculator
              </h1>
              <p className="text-text-muted mt-1">Granular FDM 3D printing cost analysis</p>
            </div>
          </div>
          <button 
            onClick={resetState} 
            className="btn-secondary text-sm flex items-center gap-2 whitespace-nowrap self-end md:self-center"
            title="Reset to Defaults"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Data Entry (8/12) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <HardwareProfileCard
              printerId={state.printerId}
              onChange={setPrinterId}
              printers={catalog.printers}
              onSaveCustomPrinter={handleSaveCustomPrinter}
              onUpdateCustomPrinter={handleUpdateCustomPrinter}
              onDeleteCustomPrinter={handleDeleteCustomPrinter}
            />
            
            <JobDetailsCard
              printTimeHours={state.printTimeHours}
              printTimeMins={state.printTimeMins}
              quantity={state.quantity}
              jobMaterials={state.jobMaterials}
              updateState={updateState}
              addJobMaterial={addJobMaterial}
              updateJobMaterial={updateJobMaterial}
              removeJobMaterial={removeJobMaterial}
              filaments={catalog.filaments}
              onSaveCustomFilament={handleSaveCustomFilament}
              onDeleteCustomFilament={handleDeleteCustomFilament}
            />

            <EconomicsCard 
              elecRate={state.elecRate}
              laborRate={state.laborRate}
              markupPercent={state.markupPercent}
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

            <SavedJobsCard
              jobs={savedJobs.jobs}
              currentState={state}
              onSave={(name) => savedJobs.saveJob(name, state)}
              onLoad={replaceState}
              onRename={savedJobs.renameJob}
              onDelete={savedJobs.deleteJob}
              onDuplicate={savedJobs.duplicateJob}
            />
          </div>

          {/* Right Column: Itemized Receipt (4/12) */}
          <div className="lg:col-span-4 relative">
            <ItemizedReceiptSidebar computed={computed} state={state} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
