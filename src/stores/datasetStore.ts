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