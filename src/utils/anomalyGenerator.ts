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
    return currentValue - adjustment;
  }
  return currentValue + adjustment;
};

const introduceWeakAnomaly = (registration: TimeRegistration): TimeRegistration => {
  const aspects = ["startTime", "endTime", "breakDuration", "workDuration", "numerical", "project"] as const;
  const aspect = aspects[Math.floor(Math.random() * aspects.length)];
  const reg = { ...registration };

  switch (aspect) {
    case "startTime":
      reg.startTime = adjustTimeValue(reg.startTime, 6, 12, "weak");
      reg.anomaly = 1;
      reg.anomalyField = "Start Time";
      break;
    case "endTime":
      reg.endTime = adjustTimeValue(reg.endTime, 14, 20, "weak");
      reg.anomaly = 1;
      reg.anomalyField = "End Time";
      break;
    case "breakDuration":
      reg.breakDuration = Number((reg.breakDuration + (Math.random() < 0.5 ? 0.5 : -0.5)).toFixed(1));
      reg.anomaly = 1;
      reg.anomalyField = "Break Duration";
      break;
    case "workDuration":
      reg.workDuration = Number((reg.workDuration + (Math.random() < 0.5 ? 1 : -1)).toFixed(1));
      reg.anomaly = 1;
      reg.anomalyField = "Work Duration";
      break;
    case "numerical":
      if (reg.numericals.length > 0) {
        const numericalIndex = Math.floor(Math.random() * reg.numericals.length);
        const numerical = reg.numericals[numericalIndex];
        numerical.value += Math.random() < 0.5 ? 1 : -1;
        reg.anomaly = 1;
        reg.anomalyField = `Numerical (${numerical.name})`;
      }
      break;
    case "project":
      reg.projectId = "Z";
      reg.anomaly = 1;
      reg.anomalyField = "Project";
      break;
  }

  return reg;
};

const introduceStrongAnomaly = (registration: TimeRegistration): TimeRegistration => {
  const aspects = ["time", "date", "numerical"] as const;
  const aspect = aspects[Math.floor(Math.random() * aspects.length)];
  const reg = { ...registration };

  switch (aspect) {
    case "time":
      const timeShift = Math.random() < 0.5 ? -3 : 3;
      reg.startTime += timeShift;
      reg.endTime += timeShift;
      reg.workDuration = Math.max(0, reg.endTime - reg.startTime - reg.breakDuration);
      reg.anomaly = 2;
      reg.anomalyField = "Time Shift";
      break;
    case "date":
      const date = new Date(reg.date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      if (isWeekend) {
        date.setDate(date.getDate() - 2); // Move to Friday
      } else {
        date.setDate(date.getDate() + (6 - date.getDay())); // Move to Saturday
      }
      reg.date = date.toISOString().split('T')[0];
      reg.anomaly = 2;
      reg.anomalyField = "Date (Weekend)";
      break;
    case "numerical":
      if (reg.numericals.length > 0) {
        const numericalIndex = Math.floor(Math.random() * reg.numericals.length);
        const numerical = reg.numericals[numericalIndex];
        numerical.value += Math.random() < 0.5 ? 3 : -3;
        reg.anomaly = 2;
        reg.anomalyField = `Numerical (${numerical.name})`;
      }
      break;
  }

  return reg;
};