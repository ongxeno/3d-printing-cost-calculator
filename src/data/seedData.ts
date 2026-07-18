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
  "mat_pla": { id: "mat_pla", name: "PLA (Standard)", price_per_kg_thb: 450, power_draw_multiplier: 1.00, hardware_wear_multiplier: 1.0 },
  "mat_petg": { id: "mat_petg", name: "PETG (Durable)", price_per_kg_thb: 450, power_draw_multiplier: 1.36, hardware_wear_multiplier: 1.0 },
  "mat_abs_asa": { id: "mat_abs_asa", name: "ABS / ASA", price_per_kg_thb: 550, power_draw_multiplier: 1.44, hardware_wear_multiplier: 1.0 },
  "mat_pa_cf": { id: "mat_pa_cf", name: "PA-CF (Carbon Fiber Nylon)", price_per_kg_thb: 1600, power_draw_multiplier: 1.20, hardware_wear_multiplier: 5.0 },
  "mat_tpu": { id: "mat_tpu", name: "TPU (Flexible)", price_per_kg_thb: 850, power_draw_multiplier: 0.85, hardware_wear_multiplier: 1.0 },
  "mat_support": { id: "mat_support", name: "Dedicated Support (PVA/HIPS)", price_per_kg_thb: 1350, power_draw_multiplier: 1.15, hardware_wear_multiplier: 1.0 },
  "mat_pla_silk": { id: "mat_pla_silk", name: "Silk PLA", price_per_kg_thb: 550, power_draw_multiplier: 1.01, hardware_wear_multiplier: 1.0 },
  "mat_pla_matte": { id: "mat_pla_matte", name: "Matte PLA", price_per_kg_thb: 450, power_draw_multiplier: 1.00, hardware_wear_multiplier: 1.5 },
  "mat_pla_wood": { id: "mat_pla_wood", name: "Wood-filled PLA", price_per_kg_thb: 550, power_draw_multiplier: 0.99, hardware_wear_multiplier: 1.5 },
  "mat_pla_glow": { id: "mat_pla_glow", name: "Glow-in-the-Dark PLA", price_per_kg_thb: 500, power_draw_multiplier: 1.00, hardware_wear_multiplier: 8.0 },
  "mat_pc": { id: "mat_pc", name: "Polycarbonate (PC)", price_per_kg_thb: 1500, power_draw_multiplier: 1.56, hardware_wear_multiplier: 1.0 },
  "mat_pp": { id: "mat_pp", name: "Polypropylene (PP)", price_per_kg_thb: 1000, power_draw_multiplier: 1.37, hardware_wear_multiplier: 1.0 },
  "mat_pom": { id: "mat_pom", name: "POM (Delrin)", price_per_kg_thb: 1500, power_draw_multiplier: 1.62, hardware_wear_multiplier: 1.0 },
  "mat_pei": { id: "mat_pei", name: "PEI (Ultem 9085/1010)", price_per_kg_thb: 12000, power_draw_multiplier: 4.29, hardware_wear_multiplier: 1.0 },
  "mat_peek": { id: "mat_peek", name: "PEEK", price_per_kg_thb: 25000, power_draw_multiplier: 5.60, hardware_wear_multiplier: 1.0 },
  "mat_petg_gf": { id: "mat_petg_gf", name: "PETG-GF (Glass Fiber)", price_per_kg_thb: 950, power_draw_multiplier: 1.14, hardware_wear_multiplier: 6.0 },
  "mat_abs_gf": { id: "mat_abs_gf", name: "ABS-GF (Glass Fiber)", price_per_kg_thb: 850, power_draw_multiplier: 1.44, hardware_wear_multiplier: 6.0 },
  "mat_pla_cf": { id: "mat_pla_cf", name: "PLA-CF (Carbon Fiber)", price_per_kg_thb: 790, power_draw_multiplier: 1.01, hardware_wear_multiplier: 5.0 },
  "mat_petg_cf": { id: "mat_petg_cf", name: "PETG-CF (Carbon Fiber)", price_per_kg_thb: 880, power_draw_multiplier: 1.36, hardware_wear_multiplier: 5.0 }
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const printerProfiles: Record<string, PrinterProfile> = {
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
      { id: generateId(), name: "AMS 2 Pro Molecular Sieve Desiccant (3A)", replacement_cost_thb: 180, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 300 },
      { id: generateId(), name: "AP (Application Processor) Board", replacement_cost_thb: 5005, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "MC (Motion Controller) Board", replacement_cost_thb: 2940, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "5-inch Touchscreen Interface", replacement_cost_thb: 5145, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Live View Camera", replacement_cost_thb: 1750, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AC Power Supply Unit", replacement_cost_thb: 2030, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Liquid Glue / Glue Sticks", replacement_cost_thb: 350, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Silicone Thermal Socks (3-pack)", replacement_cost_thb: 175, replacement_lifespan_hours: 500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AMS Filament Track Switch", replacement_cost_thb: 3490, replacement_lifespan_hours: 4000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "4-in-1 PTFE Adapter", replacement_cost_thb: 365, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 }
    ]
  },
  "creality_ender3_s1": {
    id: "creality_ender3_s1",
    name: "Creality Ender-3 S1",
    purchase_price_thb: 12000,
    estimated_lifespan_hours: 5000,
    base_power_draw_watts: 125,
    supports_multi_color: false,
    maintenance_components: [
      { id: generateId(), name: "Standard Brass Nozzle (0.4mm)", replacement_lifespan_hours: 400, replacement_cost_thb: 150, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Sprite Extruder Heater Block & Thermistor Kit", replacement_lifespan_hours: 2500, replacement_cost_thb: 934, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Polytetrafluoroethylene (PTFE) Heatbreak Liner", replacement_lifespan_hours: 800, replacement_cost_thb: 100, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Sprite Extruder Drive Gears & Bearings", replacement_lifespan_hours: 2500, replacement_cost_thb: 1200, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Polyoxymethylene (POM) Wheels (Set of 13)", replacement_lifespan_hours: 2000, replacement_cost_thb: 450, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Gates Synchronous Timing Belts (X & Y Axes)", replacement_lifespan_hours: 2500, replacement_cost_thb: 350, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Polycarbonate (PC) Spring Steel Build Plate", replacement_lifespan_hours: 1000, replacement_cost_thb: 875, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 }
    ]
  },
  "bambu_x2d_combo": {
    id: "bambu_x2d_combo",
    name: "Bambu Lab X2D Combo",
    purchase_price_thb: 40900,
    estimated_lifespan_hours: 10000,
    base_power_draw_watts: 250,
    supports_multi_color: true,
    maintenance_components: [
      { id: generateId(), name: "Stainless Steel Hotend (0.2mm)", replacement_cost_thb: 700, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Hardened Steel Hotend (Standard Flow)", replacement_cost_thb: 770, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Hardened Steel Hotend (High Flow)", replacement_cost_thb: 1820, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Tungsten Carbide Hotend (Standard Flow)", replacement_cost_thb: 2100, replacement_lifespan_hours: 3000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Tungsten Carbide Hotend (High Flow)", replacement_cost_thb: 3150, replacement_lifespan_hours: 3000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Silicone Thermal Socks (3-pack)", replacement_cost_thb: 175, replacement_lifespan_hours: 500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Complete Extruder Gear Assembly", replacement_cost_thb: 875, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Auxiliary Stepper Unit", replacement_cost_thb: 875, replacement_lifespan_hours: 4000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "1.5GT RF CoreXY Belts", replacement_cost_thb: 280, replacement_lifespan_hours: 1500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 300 },
      { id: generateId(), name: "Textured PEI Build Plate", replacement_cost_thb: 1050, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Bambu Engineering Plate", replacement_cost_thb: 1120, replacement_lifespan_hours: 1500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Cool Plate SuperTack Pro", replacement_cost_thb: 1050, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Liquid Glue / Glue Sticks", replacement_cost_thb: 350, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Activated Carbon Air Filter", replacement_cost_thb: 525, replacement_lifespan_hours: 400, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AP (Application Processor) Board", replacement_cost_thb: 5005, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "MC (Motion Controller) Board", replacement_cost_thb: 2940, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "5-inch Touchscreen Interface", replacement_cost_thb: 5145, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Live View Camera", replacement_cost_thb: 1750, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AC Power Supply Unit", replacement_cost_thb: 2030, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "TPU Feed Assist Module", replacement_cost_thb: 1750, replacement_lifespan_hours: 4000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AMS HT (High Temperature) Module", replacement_cost_thb: 5000, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "4-in-1 PTFE Adapter", replacement_cost_thb: 365, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Replacement Filament Cutter Blades (3-Pack)", replacement_cost_thb: 210, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Nozzle Wiper and Wiping Pad Assembly", replacement_cost_thb: 400, replacement_lifespan_hours: 500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 100 },
      { id: generateId(), name: "AMS Molecular Sieve Desiccant (3A)", replacement_cost_thb: 180, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 300 },
      { id: generateId(), name: "AMS Filament Track Switch", replacement_cost_thb: 3490, replacement_lifespan_hours: 4000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 }
    ]
  },
  "bambu_p2s_combo": {
    id: "bambu_p2s_combo",
    name: "Bambu Lab P2S Combo",
    purchase_price_thb: 34900,
    estimated_lifespan_hours: 10000,
    base_power_draw_watts: 200,
    supports_multi_color: true,
    maintenance_components: [
      { id: generateId(), name: "Hardened Steel Hotend (Standard)", replacement_cost_thb: 890, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Hardened Steel Hotend (H2 Series)", replacement_cost_thb: 1200, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Tungsten Carbide Extreme Hotend", replacement_cost_thb: 2450, replacement_lifespan_hours: 3000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Hotend Heating Assembly (Left)", replacement_cost_thb: 1520, replacement_lifespan_hours: 4000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Extruder Gear Assembly", replacement_cost_thb: 650, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "1.5GT 9mm RF Motion Belts", replacement_cost_thb: 280, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 300 },
      { id: generateId(), name: "Dual Texture PEI Plate", replacement_cost_thb: 890, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Cool Plate SuperTack Pro", replacement_cost_thb: 2350, replacement_lifespan_hours: 1500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Activated Carbon Filter", replacement_cost_thb: 400, replacement_lifespan_hours: 400, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AMS Filament Track Switch", replacement_cost_thb: 3490, replacement_lifespan_hours: 4000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "4-in-1 PTFE Adapter", replacement_cost_thb: 590, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Linear Rail Lubrication Routine", replacement_cost_thb: 0, replacement_lifespan_hours: 10000, periodic_maintenance_cost_thb: 50, periodic_maintenance_interval_hours: 500 },
      { id: generateId(), name: "AP (Application Processor) Board", replacement_cost_thb: 5005, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "MC (Motion Controller) Board", replacement_cost_thb: 2940, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "5-inch Touchscreen Interface", replacement_cost_thb: 5145, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Live View Camera", replacement_cost_thb: 1750, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "AC Power Supply Unit", replacement_cost_thb: 2030, replacement_lifespan_hours: 8000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Replacement Filament Cutter Blades (3-Pack)", replacement_cost_thb: 210, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Nozzle Wiper and Wiping Pad Assembly", replacement_cost_thb: 400, replacement_lifespan_hours: 500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 100 },
      { id: generateId(), name: "AMS Molecular Sieve Desiccant (3A)", replacement_cost_thb: 180, replacement_lifespan_hours: 2000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 300 },
      { id: generateId(), name: "Liquid Glue / Glue Sticks", replacement_cost_thb: 350, replacement_lifespan_hours: 1000, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
      { id: generateId(), name: "Silicone Thermal Socks (3-pack)", replacement_cost_thb: 175, replacement_lifespan_hours: 500, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 }
    ]
  }
};
