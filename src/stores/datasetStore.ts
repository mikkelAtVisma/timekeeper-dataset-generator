import { TimeRegistration } from "@/types/timeRegistration";

export type DatasetState = {
  registrations: TimeRegistration[];
  startDate: string;
  endDate: string;
};

export const INITIAL_DATASET_STATE: DatasetState = {
  registrations: [],
  startDate: "",
  endDate: "",
};

// Load dataset from localStorage
export const loadPersistedDataset = (): DatasetState => {
  const persistedData = localStorage.getItem('dataset');
  if (persistedData) {
    try {
      return JSON.parse(persistedData);
    } catch (error) {
      console.error('Error loading persisted dataset:', error);
      return INITIAL_DATASET_STATE;
    }
  }
  return INITIAL_DATASET_STATE;
};

// Save dataset to localStorage
export const persistDataset = (dataset: DatasetState) => {
  try {
    localStorage.setItem('dataset', JSON.stringify(dataset));
  } catch (error) {
    console.error('Error persisting dataset:', error);
  }
};