export interface Numerical {
  name: string;
  value: number;
}

export interface EmployeeWorkPattern {
  employeeId: string;
  allowedStartTimes: number[];
  allowedEndTimes: number[];
  departmentId: string;
  allowedWorkCategories: string[];
  canWorkWeekends: boolean;
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