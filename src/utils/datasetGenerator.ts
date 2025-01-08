import { TimeRegistration, EmployeeWorkPattern, GenerateDatasetParams, WorkPatternConfig } from "../types/timeRegistration";
import { injectAnomalies } from "./anomalyGenerator";

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

const getUniqueRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

const generateEmployeeWorkPattern = (
  employeeId: string,
  workStartRange: number[],
  workEndRange: number[],
  breakDurationRange: number[],
  departments: string[],
  workCategories: string[],
  workPatternConfig: WorkPatternConfig,
  weekendWorkerCount: number,
  totalEmployees: number,
): EmployeeWorkPattern => {
  const allStartTimes = generateTimeIncrements(workStartRange[0], workStartRange[1]);
  const allEndTimes = generateTimeIncrements(workEndRange[0], workEndRange[1]);
  const allBreakDurations = generateTimeIncrements(breakDurationRange[0], breakDurationRange[1], 0.5);

  // Get unique random start and end times
  const allowedStartTimes = getUniqueRandomElements(
    allStartTimes,
    workPatternConfig.numStartTimes
  );

  const allowedEndTimes = getUniqueRandomElements(
    allEndTimes,
    workPatternConfig.numEndTimes
  );

  const allowedBreakDurations = getUniqueRandomElements(
    allBreakDurations,
    workPatternConfig.numBreakDurations
  );

  const departmentId = departments[Math.floor(Math.random() * Math.min(departments.length, workPatternConfig.numDepartments))];

  // Get unique random work categories
  const allowedWorkCategories = getUniqueRandomElements(
    workCategories,
    workPatternConfig.numWorkCategories
  );

  const remainingEmployees = totalEmployees - parseInt(employeeId.split('-')[1]);
  const remainingRequired = workPatternConfig.minWeekendWorkers - weekendWorkerCount;
  const mustWorkWeekends = remainingRequired > 0 && remainingEmployees <= remainingRequired;
  const canWorkWeekends = mustWorkWeekends || (Math.random() < 0.2 && weekendWorkerCount < workPatternConfig.minWeekendWorkers);

  return {
    employeeId,
    allowedStartTimes,
    allowedEndTimes,
    allowedBreakDurations,
    departmentId,
    allowedWorkCategories,
    canWorkWeekends,
  };
};

export const generateDataset = (params: GenerateDatasetParams): { registrations: TimeRegistration[], patterns: EmployeeWorkPattern[] } => {
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
    existingPatterns = new Map(),
    workPatternConfig,
  } = params;

  const registrations: TimeRegistration[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Generate all possible dates within range
  const allDateRange = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    allDateRange.push(new Date(d));
  }

  // Create a map to store work patterns by employee ID
  const employeeWorkPatternsMap = new Map<string, EmployeeWorkPattern>(existingPatterns);
  let weekendWorkerCount = 0;

  // Generate or retrieve work patterns for each employee
  for (let empIdx = 0; empIdx < numEmployees; empIdx++) {
    const employeeId = `employee-${empIdx}`;
    
    if (!employeeWorkPatternsMap.has(employeeId)) {
      const workPattern = generateEmployeeWorkPattern(
        employeeId,
        workStartRange,
        workEndRange,
        breakDurationRange,
        departments,
        workCategories,
        workPatternConfig,
        weekendWorkerCount,
        numEmployees
      );
      if (workPattern.canWorkWeekends) {
        weekendWorkerCount++;
      }
      employeeWorkPatternsMap.set(employeeId, workPattern);
    }
  }

  // Convert the map to an array for the return value
  const employeeWorkPatterns = Array.from(employeeWorkPatternsMap.values());

  // Generate registrations using the stored patterns
  for (const workPattern of employeeWorkPatterns) {
    let availableDates = [...allDateRange];
    
    // Filter out weekends if employee can't work weekends and skipWeekends is true
    if (skipWeekends && !workPattern.canWorkWeekends) {
      availableDates = availableDates.filter(date => date.getDay() !== 0 && date.getDay() !== 6);
    }

    // Generate the requested number of registrations for this employee
    for (let i = 0; i < numRegistrationsPerEmployee; i++) {
      if (availableDates.length === 0) break;

      // Randomly select a date from available dates
      const randomIndex = Math.floor(Math.random() * availableDates.length);
      const date = availableDates[randomIndex];
      // Remove the used date to prevent duplicates
      availableDates.splice(randomIndex, 1);

      const startTime = workPattern.allowedStartTimes[
        Math.floor(Math.random() * workPattern.allowedStartTimes.length)
      ];

      const endTime = workPattern.allowedEndTimes[
        Math.floor(Math.random() * workPattern.allowedEndTimes.length)
      ];

      const actualEndTime = endTime <= startTime ? startTime + 8 : endTime;

      const breakDuration = workPattern.allowedBreakDurations[
        Math.floor(Math.random() * workPattern.allowedBreakDurations.length)
      ];
      
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

  if (anomalyConfig.type !== "none") {
    return {
      registrations: injectAnomalies(registrations, anomalyConfig),
      patterns: employeeWorkPatterns
    };
  }

  return {
    registrations,
    patterns: employeeWorkPatterns
  };
};