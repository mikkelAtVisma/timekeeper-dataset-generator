import { TimeRegistration } from "../types/timeRegistration";

const generateRegistrationId = () => `reg-${Math.floor(Math.random() * 10000)}`;
const generateEmployeeId = () => `employee-${Math.floor(Math.random() * 5)}`;
const generateProjectId = () => ["A", "B", "C", "D"][Math.floor(Math.random() * 4)];
const generateDepartmentId = () => ["HR", "IT", "Sales", "Marketing"][Math.floor(Math.random() * 4)];
const generateWorkCategory = () => `${Math.floor(Math.random() * 200)}`;

interface AnomalyConfig {
  type: "none" | "weak" | "strong";
  probability: number;
}

export const generateSampleData = (
  count: number = 10, 
  includeAnomalies: boolean = false,
  anomalyConfig?: AnomalyConfig
): TimeRegistration[] => {
  const registrations = Array.from({ length: count }, () => {
    const startTime = Math.floor(Math.random() * 12) + 6; // 6 AM to 6 PM
    const endTime = startTime + Math.floor(Math.random() * 8) + 4; // 4-12 hours later
    const breakDuration = Math.random() * 2; // 0-2 hours break
    const workDuration = endTime - startTime - breakDuration;

    const registration: TimeRegistration = {
      registrationId: generateRegistrationId(),
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      employeeId: generateEmployeeId(),
      projectId: generateProjectId(),
      departmentId: generateDepartmentId(),
      workCategory: generateWorkCategory(),
      startTime: startTime,
      endTime: endTime,
      workDuration: Number(workDuration.toFixed(1)),
      breakDuration: Number(breakDuration.toFixed(1)),
      publicHoliday: Math.random() > 0.9,
      numericals: [
        {
          name: "productivity",
          value: Math.floor(Math.random() * 100),
        },
        {
          name: "quality",
          value: Math.floor(Math.random() * 100),
        },
      ],
      anomaly: 0,
    };

    if (includeAnomalies && anomalyConfig && Math.random() < anomalyConfig.probability) {
      const anomalyValue = anomalyConfig.type === "weak" ? 1 : 2;
      const aspects = ["workDuration", "breakDuration", "startTime", "endTime", "numericals"];
      const anomalousAspect = aspects[Math.floor(Math.random() * aspects.length)];
      
      registration.anomaly = anomalyValue;
      registration.anomalyField = anomalousAspect;

      // Introduce the anomaly
      switch (anomalousAspect) {
        case "workDuration":
          registration.workDuration += anomalyValue * 2;
          break;
        case "breakDuration":
          registration.breakDuration += anomalyValue;
          break;
        case "startTime":
          registration.startTime += anomalyValue * 2;
          break;
        case "endTime":
          registration.endTime += anomalyValue * 2;
          break;
        case "numericals":
          registration.numericals[0].value += anomalyValue * 10;
          break;
      }
    }

    return registration;
  });

  return registrations;
};