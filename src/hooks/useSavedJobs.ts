import { useState, useEffect } from 'react';
import type { CalculatorState } from '../utils/formulas';
import {
  loadSavedJobs,
  persistSavedJobs,
  addSavedJob,
  renameSavedJob,
  deleteSavedJob,
  duplicateSavedJob,
} from '../utils/savedJobs';

export const useSavedJobs = () => {
  const [jobs, setJobs] = useState(loadSavedJobs);

  useEffect(() => {
    persistSavedJobs(jobs);
  }, [jobs]);

  const saveJob = (name: string, state: CalculatorState) => {
    setJobs(prev => addSavedJob(prev, name, state));
  };

  const renameJob = (id: string, name: string) => {
    setJobs(prev => renameSavedJob(prev, id, name));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => deleteSavedJob(prev, id));
  };

  const duplicateJob = (id: string) => {
    setJobs(prev => duplicateSavedJob(prev, id));
  };

  return { jobs, saveJob, renameJob, deleteJob, duplicateJob };
};
