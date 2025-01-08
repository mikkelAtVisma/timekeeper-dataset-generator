export interface Numerical {
  name: string;
  value: number;
}

export interface EmployeeWorkPattern {
  employeeId: string;
  allowedStartTimes: number[];
  allowedEndTimes: number[];
  allowedBreakDurations: number[];
  departmentId: string;
  allowedWorkCategories: string[];
  canWorkWeekends: boolean;
}

export interface WorkPatternConfig {
  numDepartments: number;
  numStartTimes: number;
  numEndTimes: number;
  numBreakDurations: number;
  numWorkCategories: number;
  minWeekendWorkers: number;
}

export interface TimeRegistration {
  registrationId: string;
  date: string;
  employeeId: string;
  projectId: string;
  departmentId: string;
  workCategory: string;
  startTime: number;
  endTime: number;
  workDuration: number;
  breakDuration: number;
  publicHoliday: boolean;
  numericals: Numerical[];
  anomaly?: number;
  anomalyField?: string;
}

export interface GenerateDatasetParams {
  numEmployees: number;
  startDate: string;
  endDate: string;
  projects: string[];
  workCategories: string[];
  departments: string[];
  numRegistrationsPerEmployee: number;
  workStartRange: number[];
  workEndRange: number[];
  breakDurationRange: number[];
  skipWeekends: boolean;
  randomizeAssignments: boolean;
  anomalyConfig: {
    type: "none" | "weak" | "strong" | "both";
    probability: number;
  };
  existingPatterns?: Map<string, EmployeeWorkPattern>;
  workPatternConfig: WorkPatternConfig;
}