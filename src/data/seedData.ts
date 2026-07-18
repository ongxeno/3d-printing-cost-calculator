export interface FilamentPreset {
  id: string;
  name: string;
  price_per_kg_thb: number;
  power_draw_multiplier: number;
  hardware_wear_multiplier: number;
}

export interface MaintenanceComponent {
  id: string;
  name: string;
  replacement_cost_thb: number;
  replacement_lifespan_hours: number;
  periodic_maintenance_cost_thb: number;
  periodic_maintenance_interval_hours: number;
}

export interface PrinterProfile {
  id: string;
  name: string;
  purchase_price_thb: number;
  estimated_lifespan_hours: number;
  base_power_draw_watts: number;
  supports_multi_color: boolean;
  maintenance_components: MaintenanceComponent[];
}

export const filamentPresets: Record<string, FilamentPreset> = {
  "mat_pla": { id: "mat_pla", name: "PLA (Standard)", price_per_kg_thb: 350, power_draw_multiplier: 1, hardware_wear_multiplier: 1 },
  "mat_petg": { id: "mat_petg", name: "PETG (Durable)", price_per_kg_thb: 400, power_draw_multiplier: 1.2, hardware_wear_multiplier: 1 },
  "mat_abs": { id: "mat_abs", name: "ABS / ASA", price_per_kg_thb: 800, power_draw_multiplier: 2, hardware_wear_multiplier: 1 },
  "mat_cf_nylon": { id: "mat_cf_nylon", name: "PA-CF (Carbon Fiber Nylon)", price_per_kg_thb: 2500, power_draw_multiplier: 2, hardware_wear_multiplier: 3 },
  "mat_tpu": { id: "mat_tpu", name: "TPU (Flexible)", price_per_kg_thb: 650, power_draw_multiplier: 1.5, hardware_wear_multiplier: 1 },
  "mat_support_interface": { id: "mat_support_interface", name: "Dedicated Support (PVA/HIPS)", price_per_kg_thb: 1500, power_draw_multiplier: 1, hardware_wear_multiplier: 1 }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const printerProfiles: Record<string, PrinterProfile> = {
  "bambu_combo_complete": {
    id: "bambu_combo_complete",
    name: "Bambu Lab X1C Combo",
    purchase_price_thb: 79900,
    estimated_lifespan_hours: 10000,
    base_power_draw_watts: 197,
    supports_multi_color: true,
    maintenance_components: [
      { id: generateId(), name: "Complete Hotend / Nozzle (Hardened)", replacement_lifespan_hours: 1500, replacement_cost_thb: 1200, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Extruder Gear Assembly (Hardened)", replacement_lifespan_hours: 2000, replacement_cost_thb: 800, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "PTFE Tubes (Internal & AMS)", replacement_lifespan_hours: 1000, replacement_cost_thb: 200, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Filament Cutter Blades", replacement_lifespan_hours: 1000, replacement_cost_thb: 150, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Hotend Silicone Socks", replacement_lifespan_hours: 200, replacement_cost_thb: 50, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Activated Carbon Air Filter", replacement_lifespan_hours: 300, replacement_cost_thb: 400, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Build Plates (Textured PEI)", replacement_lifespan_hours: 1500, replacement_cost_thb: 1500, periodic_maintenance_cost_thb: 200, periodic_maintenance_interval_hours: 50 },
      { id: generateId(), name: "X-Axis Carbon Rods / Linear Rails", replacement_lifespan_hours: 4000, replacement_cost_thb: 3000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Z-Axis Lead Screws", replacement_lifespan_hours: 2500, replacement_cost_thb: 1200, periodic_maintenance_cost_thb: 100, periodic_maintenance_interval_hours: 100 },
      { id: generateId(), name: "CoreXY Rubber Belts", replacement_lifespan_hours: 3000, replacement_cost_thb: 800, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AMS First Stage Feeder components", replacement_lifespan_hours: 2500, replacement_cost_thb: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AMS Driven Hub components", replacement_lifespan_hours: 2000, replacement_cost_thb: 1200, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 }
    ]
  },
  "prusa_mk4": {
    id: "prusa_mk4",
    name: "Original Prusa MK4",
    purchase_price_thb: 42000,
    estimated_lifespan_hours: 8000,
    base_power_draw_watts: 110,
    supports_multi_color: false,
    maintenance_components: [
      { id: generateId(), name: "Nextruder Nozzle", replacement_lifespan_hours: 2000, replacement_cost_thb: 1200, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Spring Steel Sheet", replacement_lifespan_hours: 1500, replacement_cost_thb: 1500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Fans", replacement_lifespan_hours: 4000, replacement_cost_thb: 600, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Linear Bearings", replacement_lifespan_hours: 3000, replacement_cost_thb: 800, periodic_maintenance_cost_thb: 200, periodic_maintenance_interval_hours: 150 }
    ]
  },
  "creality_ender3_v3": {
    id: "creality_ender3_v3",
    name: "Creality Ender-3 V3",
    purchase_price_thb: 14000,
    estimated_lifespan_hours: 3000,
    base_power_draw_watts: 110,
    supports_multi_color: false,
    maintenance_components: [
      { id: generateId(), name: "Brass Nozzle", replacement_lifespan_hours: 500, replacement_cost_thb: 150, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Build Plate", replacement_lifespan_hours: 1000, replacement_cost_thb: 800, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "V-Slot Wheels", replacement_lifespan_hours: 1500, replacement_cost_thb: 400, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 }
    ]
  },
  "creality_s1_pro_sonic": {
    id: "creality_s1_pro_sonic",
    name: "Creality Ender-3 S1 Pro + Sonic Pad",
    purchase_price_thb: 19500,
    estimated_lifespan_hours: 4000,
    base_power_draw_watts: 120,
    supports_multi_color: false,
    maintenance_components: [
      { id: generateId(), name: "Sprite Extruder Assembly", replacement_lifespan_hours: 2500, replacement_cost_thb: 1800, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "High-Temp Nozzle", replacement_lifespan_hours: 800, replacement_cost_thb: 250, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "PEI Spring Steel Sheet", replacement_lifespan_hours: 1000, replacement_cost_thb: 1200, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "POM V-Slot Wheels", replacement_lifespan_hours: 1500, replacement_cost_thb: 400, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Dual Z-Axis Lead Screws", replacement_lifespan_hours: 4000, replacement_cost_thb: 800, periodic_maintenance_cost_thb: 100, periodic_maintenance_interval_hours: 100 },
      { id: generateId(), name: "X/Y Timing Belts", replacement_lifespan_hours: 2000, replacement_cost_thb: 500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 }
    ]
  },
  "bambu_h2c_combo": {
    id: "bambu_h2c_combo",
    name: "Bambu Lab H2C Combo",
    purchase_price_thb: 97900,
    estimated_lifespan_hours: 10000,
    base_power_draw_watts: 250,
    supports_multi_color: true,
    maintenance_components: [
      { id: generateId(), name: "Vortek Hardened Steel Induction Hotend (0.4mm / 0.6mm / 0.8mm)", replacement_cost_thb: 1990, replacement_lifespan_hours: 1500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 100 },
      { id: generateId(), name: "Vortek Stainless Steel Induction Hotend (0.2mm)", replacement_cost_thb: 1990, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 100 },
      { id: generateId(), name: "Fixed Left Standard Hotend (0.4mm Hardened Steel)", replacement_cost_thb: 1200, replacement_lifespan_hours: 1500, periodic_maintenance_cost_thb: 50, periodic_maintenance_interval_hours: 200 },
      { id: generateId(), name: "Three-Stage Air Filtration Assembly (G3 / H12 HEPA / Activated Carbon)", replacement_cost_thb: 1400, replacement_lifespan_hours: 300, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "CoreXY Gantry Drive Belts (XY)", replacement_cost_thb: 740, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 300 },
      { id: generateId(), name: "Z-Axis Lead Screws and Linear Guide Rods", replacement_cost_thb: 2500, replacement_lifespan_hours: 10000, periodic_maintenance_cost_thb: 100, periodic_maintenance_interval_hours: 300 },
      { id: generateId(), name: "Bambu Textured PEI Build Plate (H2C Exclusive)", replacement_cost_thb: 2490, replacement_lifespan_hours: 1500, periodic_maintenance_cost_thb: 20, periodic_maintenance_interval_hours: 50 },
      { id: generateId(), name: "DynaSense Hardened Steel Extruder Gear Assembly", replacement_cost_thb: 1200, replacement_lifespan_hours: 3000, periodic_maintenance_cost_thb: 50, periodic_maintenance_interval_hours: 300 },
      { id: generateId(), name: "Replacement Filament Cutter Blades (3-Pack)", replacement_cost_thb: 210, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Nozzle Wiper and Wiping Pad Assembly", replacement_cost_thb: 400, replacement_lifespan_hours: 500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 100 },
      { id: generateId(), name: "Induction Hotend Rack & Magnetic Latch Mechanism", replacement_cost_thb: 4500, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 500 },
      { id: generateId(), name: "Vision Encoder & Optical Sensor Array", replacement_cost_thb: 2990, replacement_lifespan_hours: 10000, periodic_maintenance_cost_thb: 10, periodic_maintenance_interval_hours: 100 },
      { id: generateId(), name: "AMS 2 Pro Molecular Sieve Desiccant (3A)", replacement_cost_thb: 180, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 300 }
    ]
  }
};
