import { TimeRegistration, Numerical } from "../types/timeRegistration";

type AnomalyType = "weak" | "strong";

export const injectAnomalies = (
  registrations: TimeRegistration[],
  config: { type: "none" | "weak" | "strong"; probability: number }
): TimeRegistration[] => {
  return registrations.map(registration => {
    const shouldInjectAnomaly = Math.random() < config.probability;
    
    if (!shouldInjectAnomaly) {
      return registration;
    }
    
    if (config.type === "weak") {
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
      break;
    case "endTime":
      reg.endTime = adjustTimeValue(reg.endTime, 14, 20, "weak");
      break;
    case "breakDuration":
      reg.breakDuration = Number((reg.breakDuration + (Math.random() < 0.5 ? 0.5 : -0.5)).toFixed(1));
      break;
    case "workDuration":
      reg.workDuration = Number((reg.workDuration + (Math.random() < 0.5 ? 1 : -1)).toFixed(1));
      break;
    case "numerical":
      if (reg.numericals.length > 0) {
        const numericalIndex = Math.floor(Math.random() * reg.numericals.length);
        const numerical = reg.numericals[numericalIndex];
        numerical.value += Math.random() < 0.5 ? 1 : -1;
      }
      break;
    case "project":
      reg.projectId = "Z"; // Anomalous project ID
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
      break;
    case "date":
      // Convert weekday to weekend or vice versa
      const date = new Date(reg.date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      if (isWeekend) {
        date.setDate(date.getDate() - 2); // Move to Friday
      } else {
        date.setDate(date.getDate() + (6 - date.getDay())); // Move to Saturday
      }
      reg.date = date.toISOString().split('T')[0];
      break;
    case "numerical":
      if (reg.numericals.length > 0) {
        const numericalIndex = Math.floor(Math.random() * reg.numericals.length);
        const numerical = reg.numericals[numericalIndex];
        numerical.value += Math.random() < 0.5 ? 3 : -3;
      }
      break;
  }

  return reg;
};
