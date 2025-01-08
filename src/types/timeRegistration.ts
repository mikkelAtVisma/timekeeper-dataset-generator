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
}