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

const STORAGE_KEY = "dataset";

export const loadPersistedDataset = (): DatasetState => {
  try {
    const persistedData = localStorage.getItem(STORAGE_KEY);
    if (!persistedData) return INITIAL_DATASET_STATE;

    const parsed = JSON.parse(persistedData);
    return {
      registrations: parsed.registrations || [],
      startDate: parsed.startDate || "",
      endDate: parsed.endDate || "",
    };
  } catch (error) {
    console.error("Error loading persisted dataset:", error);
    return INITIAL_DATASET_STATE;
  }
};

export const persistDataset = (dataset: DatasetState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataset));
  } catch (error) {
    console.error("Error persisting dataset:", error);
  }
};

export function clearSavedDataset() {
  localStorage.removeItem(STORAGE_KEY);
}