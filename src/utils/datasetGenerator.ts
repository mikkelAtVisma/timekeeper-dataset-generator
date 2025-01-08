import { TimeRegistration } from "../types/timeRegistration";
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

  // Generate registrations for each employee
  for (let empIdx = 0; empIdx < numEmployees; empIdx++) {
    const employeeId = `employee-${empIdx}`;
    const departmentId = departments[empIdx % departments.length];
    
    // Generate registrations
    for (let i = 0; i < numRegistrationsPerEmployee; i++) {
      const date = dateRange[Math.floor(Math.random() * dateRange.length)];
      
      // Generate start time with weighted preference
      const startTimes = generateTimeIncrements(workStartRange[0], workStartRange[1]);
      const startTimeWeights = startTimes.map(time => 
        time === startTimes[0] ? 0.7 : 0.1
      );
      const startTime = weightedRandomChoice(startTimes, startTimeWeights);

      // Generate end time with weighted preference
      const endTimes = generateTimeIncrements(workEndRange[0], workEndRange[1]);
      const validEndTimes = endTimes.filter(time => time > startTime);
      const endTimeWeights = validEndTimes.map(time => 
        time === validEndTimes[validEndTimes.length - 1] ? 0.7 : 0.1
      );
      const endTime = weightedRandomChoice(validEndTimes, endTimeWeights);

      // Generate break duration with increments
      const breakTimes = generateTimeIncrements(breakDurationRange[0], breakDurationRange[1], 0.5);
      const breakDuration = breakTimes[Math.floor(Math.random() * breakTimes.length)];
      const workDuration = endTime - startTime - breakDuration;

      registrations.push({
        registrationId: `reg-${registrations.length}`,
        date: date.toISOString().split('T')[0],
        employeeId,
        projectId: randomizeAssignments ? 
          projects[Math.floor(Math.random() * projects.length)] : 
          projects[empIdx % projects.length],
        departmentId,
        workCategory: randomizeAssignments ? 
          workCategories[Math.floor(Math.random() * workCategories.length)] : 
          workCategories[empIdx % workCategories.length],
        startTime,
        endTime,
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