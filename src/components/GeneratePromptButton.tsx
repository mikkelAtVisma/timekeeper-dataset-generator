import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TimeRegistration } from "@/types/timeRegistration";
import { startOfWeek, addMonths, addWeeks, format } from "date-fns";

interface GeneratePromptButtonProps {
  onGenerateDataset: (registrations: TimeRegistration[], startDate: string, endDate: string) => void;
  currentSettings: {
    numEmployees: number;
    projects: string[];
    workCategories: string[];
    departments: string[];
    numRegistrations: number[];
    workStartRange: number[];
    workEndRange: number[];
    breakDurationRange: number[];
    skipWeekends: boolean;
    randomizeAssignments: boolean;
    workPatternConfig: {
      numDepartments: number;
      numStartTimes: number;
      numEndTimes: number;
      numBreakDurations: number;
      numWorkCategories: number;
      minWeekendWorkers: number;
    };
  };
}

export const GeneratePromptButton = ({ onGenerateDataset, currentSettings }: GeneratePromptButtonProps) => {
  const { toast } = useToast();

  const formatRegistrationsForCopy = (registrations: TimeRegistration[]) => {
    return registrations
      .map((reg) => {
        const formattedDuration = `${reg.workDuration}h`;
        const formattedBreak = `${reg.breakDuration}h`;
        return [
          "0",
          reg.date,
          reg.employeeId,
          reg.projectId,
          reg.departmentId,
          reg.workCategory,
          formatTime(reg.startTime),
          formatTime(reg.endTime),
          formattedDuration,
          formattedBreak,
          reg.publicHoliday ? "Yes" : "No"
        ].join("\t");
      })
      .join("\n");
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleGeneratePrompt = async () => {
    // Generate dates
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const oneMonthLater = addMonths(monday, 1);
    const oneWeekLater = addWeeks(oneMonthLater, 1);

    const startDate = format(monday, 'yyyy-MM-dd');
    const endDate = format(oneMonthLater, 'yyyy-MM-dd');
    const anomalyEndDate = format(oneWeekLater, 'yyyy-MM-dd');

    try {
      // Generate first dataset (no anomalies)
      const { generateDataset } = await import('../utils/datasetGenerator');
      const normalResult = generateDataset({
        ...currentSettings,
        startDate,
        endDate,
        numRegistrationsPerEmployee: currentSettings.numRegistrations[0],
        anomalyConfig: {
          type: "none",
          probability: 0
        },
        existingPatterns: new Map()
      });

      // Generate second dataset (with anomalies)
      const anomalyResult = generateDataset({
        ...currentSettings,
        startDate: format(oneMonthLater, 'yyyy-MM-dd'),
        endDate: anomalyEndDate,
        numRegistrationsPerEmployee: currentSettings.numRegistrations[0],
        anomalyConfig: {
          type: "both",
          probability: 0.33
        },
        existingPatterns: new Map(normalResult.patterns.map(p => [p.employeeId, p]))
      });

      // Combine datasets and update the table
      onGenerateDataset(
        [...normalResult.registrations, ...anomalyResult.registrations],
        startDate,
        anomalyEndDate
      );

      // Format the prompt with the new introduction
      const prompt = `You are TimeDetect

Your task is to approve time registrations of an department containing 5 employees. You have to approve, request information, or deny registrations.

Example anomalies include:

Employees registering too much overtime
Unusually high or low total amount of work hours for a day
Unusual start time, end time or break time
Forgotten or left out registrations
Working weekends, or holidays

In general, the more of a pattern an employee follows, the more suspicious you should be, if that pattern is no longer followed. You should try and garner a theory about the employee work pattern by observing the patterns they work, and report any deviation, blocking the registration for approval. If you are uncertain, just block it, better be safe than sorry.

To guide your decision making, you have the previous month of registrations, that you can use to guide your decision as to whether a registration is anomalous.

The registrations from the previous months are here, with the columns:

Status: always (0) or blank
Date
Employee
Project
Department
Category
Start Time
End Time
Duration
Break
Holiday

${formatRegistrationsForCopy(normalResult.registrations)}
 
These are the registrations for which you must make a decision to approve, request information, or deny. Whatever you do, provide a comment for why you do what you do.

${formatRegistrationsForCopy(anomalyResult.registrations)}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(prompt);

      toast({
        title: "Prompt Generated",
        description: "The prompt has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate prompt",
        variant: "destructive",
      });
      console.error("Error generating prompt:", error);
    }
  };

  return (
    <Button onClick={handleGeneratePrompt} className="ml-2">
      Generate Prompt
    </Button>
  );
};