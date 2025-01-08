export interface Numerical {
  name: string;
  value: number;
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
  anomaly?: number; // 0 for normal, 1 for weak anomaly, 2 for strong anomaly
}