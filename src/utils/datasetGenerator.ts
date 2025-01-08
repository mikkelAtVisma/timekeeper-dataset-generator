import { TimeRegistration, EmployeeWorkPattern } from "../types/timeRegistration";
import { injectAnomalies } from "./anomalyGenerator";

interface GenerateDatasetParams {
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
    type: "none" | "weak" | "strong";
    probability: number;
  };
}

const generateTimeIncrements = (start: number, end: number, step: number = 0.5): number[] => {
  const times: number[] = [];
  for (let time = start; time <= end; time += step) {
    times.push(Number(time.toFixed(2)));
  }
  return times;
};

const normalizeWeights = (weights: number[]): number[] => {
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map(w => w / sum);
};

const weightedRandomChoice = (options: number[], weights: number[]): number => {
  const normalizedWeights = normalizeWeights(weights);
  const random = Math.random();
  let cumSum = 0;
  
  for (let i = 0; i < options.length; i++) {
    cumSum += normalizedWeights[i];
    if (random <= cumSum) {
      return options[i];
    }
  }
  
  return options[options.length - 1];
};

const generateEmployeeWorkPattern = (
  employeeId: string,
  workStartRange: number[],
  workEndRange: number[],
  departments: string[],
  workCategories: string[],
): EmployeeWorkPattern => {
  // Generate a subset of allowed start times
  const allStartTimes = generateTimeIncrements(workStartRange[0], workStartRange[1]);
  const numStartTimes = Math.floor(Math.random() * (allStartTimes.length - 2)) + 2; // At least 2 start times
  const allowedStartTimes = allStartTimes
    .sort(() => Math.random() - 0.5)
    .slice(0, numStartTimes);

  // Generate a subset of allowed end times
  const allEndTimes = generateTimeIncrements(workEndRange[0], workEndRange[1]);
  const numEndTimes = Math.floor(Math.random() * (allEndTimes.length - 2)) + 2; // At least 2 end times
  const allowedEndTimes = allEndTimes
    .sort(() => Math.random() - 0.5)
    .slice(0, numEndTimes);

  // Assign a department
  const departmentId = departments[Math.floor(Math.random() * departments.length)];

  // Generate a subset of allowed work categories
  const numWorkCategories = Math.floor(Math.random() * (workCategories.length - 1)) + 1; // At least 1 category
  const allowedWorkCategories = workCategories
    .sort(() => Math.random() - 0.5)
    .slice(0, numWorkCategories);

  // 20% chance of being allowed to work weekends
  const canWorkWeekends = Math.random() < 0.2;

  return {
    employeeId,
    allowedStartTimes,
    allowedEndTimes,
    departmentId,
    allowedWorkCategories,
    canWorkWeekends,
  };
};

export const generateDataset = (params: GenerateDatasetParams): TimeRegistration[] => {
  const {
    numEmployees,
    startDate,
    endDate,
    projects,
    workCategories,
    departments,
    numRegistrationsPerEmployee,
    workStartRange,
    workEndRange,
    breakDurationRange,
    skipWeekends,
    randomizeAssignments,
    anomalyConfig,
  } = params;

  const registrations: TimeRegistration[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateRange = [];
  
  // Generate date range
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (!skipWeekends || (d.getDay() !== 0 && d.getDay() !== 6)) {
      dateRange.push(new Date(d));
    }
  }

  // Generate work patterns for each employee
  const employeeWorkPatterns: EmployeeWorkPattern[] = [];
  for (let empIdx = 0; empIdx < numEmployees; empIdx++) {
    const employeeId = `employee-${empIdx}`;
    const workPattern = generateEmployeeWorkPattern(
      employeeId,
      workStartRange,
      workEndRange,
      departments,
      workCategories
    );
    employeeWorkPatterns.push(workPattern);
  }

  // Generate registrations for each employee according to their work pattern
  for (const workPattern of employeeWorkPatterns) {
    for (let i = 0; i < numRegistrationsPerEmployee; i++) {
      let date;
      do {
        date = dateRange[Math.floor(Math.random() * dateRange.length)];
      } while (!workPattern.canWorkWeekends && (date.getDay() === 0 || date.getDay() === 6));

      const startTime = workPattern.allowedStartTimes[
        Math.floor(Math.random() * workPattern.allowedStartTimes.length)
      ];

      const endTime = workPattern.allowedEndTimes[
        Math.floor(Math.random() * workPattern.allowedEndTimes.length)
      ];

      // Ensure end time is after start time
      const actualEndTime = endTime <= startTime ? startTime + 8 : endTime;

      const breakTimes = generateTimeIncrements(breakDurationRange[0], breakDurationRange[1], 0.5);
      const breakDuration = breakTimes[Math.floor(Math.random() * breakTimes.length)];
      const workDuration = actualEndTime - startTime - breakDuration;

      registrations.push({
        registrationId: `reg-${registrations.length}`,
        date: date.toISOString().split('T')[0],
        employeeId: workPattern.employeeId,
        projectId: randomizeAssignments ? 
          projects[Math.floor(Math.random() * projects.length)] : 
          projects[parseInt(workPattern.employeeId.split('-')[1]) % projects.length],
        departmentId: workPattern.departmentId,
        workCategory: workPattern.allowedWorkCategories[
          Math.floor(Math.random() * workPattern.allowedWorkCategories.length)
        ],
        startTime,
        endTime: actualEndTime,
        workDuration,
        breakDuration,
        publicHoliday: Math.random() > 0.9,
        numericals: [],
        anomaly: 0,
      });
    }
  }

  // Apply anomalies if configured
  if (anomalyConfig.type !== "none") {
    return injectAnomalies(registrations, anomalyConfig);
  }

  return registrations;
};