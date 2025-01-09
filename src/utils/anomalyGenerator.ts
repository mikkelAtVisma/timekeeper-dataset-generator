import { TimeRegistration, Numerical } from "../types/timeRegistration";

type AnomalyType = "weak" | "strong" | "both";

export const injectAnomalies = (
  registrations: TimeRegistration[],
  config: { type: "none" | "weak" | "strong" | "both"; probability: number }
): TimeRegistration[] => {
  return registrations.map(registration => {
    const shouldInjectAnomaly = Math.random() < config.probability;
    
    if (!shouldInjectAnomaly) {
      return registration;
    }
    
    if (config.type === "both") {
      // 50% chance for each type when "both" is selected
      return Math.random() < 0.5 ? 
        introduceWeakAnomaly(registration) : 
        introduceStrongAnomaly(registration);
    } else if (config.type === "weak") {
      return introduceWeakAnomaly(registration);
    } else if (config.type === "strong") {
      return introduceStrongAnomaly(registration);
    }
    
    return registration;
  });
};

const adjustTimeValue = (
  currentValue: number,
  minValue: number,
  maxValue: number,
  strength: AnomalyType
): number => {
  const adjustment = strength === "weak" ? 1 : 3;
  if (currentValue - minValue < maxValue - currentValue) {
    return Math.max(minValue, currentValue - adjustment);
  }
  return Math.min(maxValue, currentValue + adjustment);
};

const recalculateWorkDuration = (startTime: number, endTime: number, breakDuration: number): number => {
  return Math.max(0, endTime - startTime - breakDuration);
};

const introduceWeakAnomaly = (registration: TimeRegistration): TimeRegistration => {
  const aspects = ["startTime", "endTime", "breakDuration", "workDuration", "numerical", "project"] as const;
  const aspect = aspects[Math.floor(Math.random() * aspects.length)];
  const reg = { ...registration };

  switch (aspect) {
    case "startTime": {
      reg.startTime = adjustTimeValue(reg.startTime, 6, 12, "weak");
      reg.workDuration = recalculateWorkDuration(reg.startTime, reg.endTime, reg.breakDuration);
      reg.anomaly = 1;
      reg.anomalyField = "Start Time";
      break;
    }
    case "endTime": {
      reg.endTime = adjustTimeValue(reg.endTime, 14, 20, "weak");
      reg.workDuration = recalculateWorkDuration(reg.startTime, reg.endTime, reg.breakDuration);
      reg.anomaly = 1;
      reg.anomalyField = "End Time";
      break;
    }
    case "breakDuration": {
      reg.breakDuration = Number((reg.breakDuration + (Math.random() < 0.5 ? 0.5 : -0.5)).toFixed(1));
      reg.workDuration = recalculateWorkDuration(reg.startTime, reg.endTime, reg.breakDuration);
      reg.anomaly = 1;
      reg.anomalyField = "Break Duration";
      break;
    }
    case "workDuration": {
      reg.workDuration = Number((reg.workDuration + (Math.random() < 0.5 ? 1 : -1)).toFixed(1));
      reg.anomaly = 1;
      reg.anomalyField = "Work Duration";
      break;
    }
    case "numerical": {
      if (reg.numericals.length > 0) {
        const numericalIndex = Math.floor(Math.random() * reg.numericals.length);
        const numerical = reg.numericals[numericalIndex];
        numerical.value += Math.random() < 0.5 ? 1 : -1;
        reg.anomaly = 1;
        reg.anomalyField = `Numerical (${numerical.name})`;
      }
      break;
    }
    case "project": {
      reg.projectId = "Z";
      reg.anomaly = 1;
      reg.anomalyField = "Project";
      break;
    }
  }

  return reg;
};

const introduceStrongAnomaly = (registration: TimeRegistration): TimeRegistration => {
  const aspects = ["time", "date", "numerical"] as const;
  const aspect = aspects[Math.floor(Math.random() * aspects.length)];
  const reg = { ...registration };

  switch (aspect) {
    case "time": {
      const timeShift = Math.random() < 0.5 ? -3 : 3;
      reg.startTime += timeShift;
      reg.endTime += timeShift;
      reg.workDuration = recalculateWorkDuration(reg.startTime, reg.endTime, reg.breakDuration);
      reg.anomaly = 2;
      reg.anomalyField = "Time Shift";
      break;
    }
    case "date": {
      const date = new Date(reg.date);
      const currentDay = date.getDay();
      const isWeekend = currentDay === 0 || currentDay === 6;
      
      if (!isWeekend) {
        // If it's a weekday, move to the next Saturday
        const daysUntilSaturday = 6 - currentDay;
        date.setDate(date.getDate() + daysUntilSaturday);
        reg.date = date.toISOString().split('T')[0];
        reg.anomaly = 2;
        reg.anomalyField = "Date (Weekend)";
      }
      break;
    }
    case "numerical": {
      if (reg.numericals.length > 0) {
        const numericalIndex = Math.floor(Math.random() * reg.numericals.length);
        const numerical = reg.numericals[numericalIndex];
        numerical.value += Math.random() < 0.5 ? 3 : -3;
        reg.anomaly = 2;
        reg.anomalyField = `Numerical (${numerical.name})`;
      }
      break;
    }
  }

  return reg;
};