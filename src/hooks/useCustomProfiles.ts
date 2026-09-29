import { useState, useEffect, useMemo } from 'react';
import {
  loadCustomProfiles,
  saveCustomProfiles,
  mergeProfiles,
  upsertCustomFilament,
  removeCustomFilament,
  upsertCustomPrinter,
  removeCustomPrinter,
} from '../utils/profiles';
import type { FilamentValues, PrinterValues } from '../utils/profiles';

export const useCustomProfiles = () => {
  const [custom, setCustom] = useState(loadCustomProfiles);

  useEffect(() => {
    saveCustomProfiles(custom);
  }, [custom]);

  const catalog = useMemo(() => mergeProfiles(custom), [custom]);

  const saveFilament = (name: string, values: FilamentValues, id?: string): string => {
    const result = upsertCustomFilament(custom, name, values, id);
    setCustom(result.custom);
    return result.id;
  };

  const deleteFilament = (id: string): void => {
    setCustom(removeCustomFilament(custom, id));
  };

  const savePrinter = (name: string, values: PrinterValues, id?: string): string => {
    const result = upsertCustomPrinter(custom, name, values, id);
    setCustom(result.custom);
    return result.id;
  };

  const deletePrinter = (id: string): void => {
    setCustom(removeCustomPrinter(custom, id));
  };

  return { custom, catalog, saveFilament, deleteFilament, savePrinter, deletePrinter };
};
