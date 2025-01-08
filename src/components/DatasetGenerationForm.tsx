import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { TimeRegistration } from "../types/timeRegistration";
import { Switch } from "@/components/ui/switch";
import { startOfWeek, addMonths, format } from "date-fns";

interface DatasetGenerationFormProps {
  onGenerate: (registrations: TimeRegistration[]) => void;
}

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
}

// Get the Monday of the current week and format it as YYYY-MM-DD
const getInitialStartDate = () => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
};

const getInitialEndDate = () => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const monthLater = addMonths(monday, 1);
  return format(monthLater, 'yyyy-MM-dd');
};

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

const generateDataset = ({
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
}: GenerateDatasetParams): TimeRegistration[] => {
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

  return registrations;
};

export const DatasetGenerationForm = ({ onGenerate }: DatasetGenerationFormProps) => {
  const { toast } = useToast();
  const [numEmployees, setNumEmployees] = useState(5);
  const [startDate, setStartDate] = useState(getInitialStartDate());
  const [endDate, setEndDate] = useState(getInitialEndDate());
  const [projects] = useState(["A", "B", "C", "D"]);
  const [workCategories] = useState(["Development", "Testing", "Meetings", "Documentation"]);
  const [departments] = useState(["HR", "IT", "Sales", "Marketing"]);
  const [numRegistrations, setNumRegistrations] = useState([35]);
  
  // New state variables for additional controls
  const [workStartRange, setWorkStartRange] = useState([7, 9]); // 7-9 AM
  const [workEndRange, setWorkEndRange] = useState([16, 18]); // 4-6 PM
  const [breakDurationRange, setBreakDurationRange] = useState([0.5, 2]); // 0.5-2 hours
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [randomizeAssignments, setRandomizeAssignments] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      toast({
        title: "Error",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return;
    }

    // Generate data using the parameters
    const registrations = generateDataset({
      numEmployees,
      startDate,
      endDate,
      projects,
      workCategories,
      departments,
      numRegistrationsPerEmployee: numRegistrations[0],
      workStartRange,
      workEndRange,
      breakDurationRange,
      skipWeekends,
      randomizeAssignments,
    });

    onGenerate(registrations);
    
    toast({
      title: "Success",
      description: "Dataset generated successfully",
    });
  };

  // ... keep existing code (form JSX)

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-2">
        <Label htmlFor="numEmployees">Number of Employees</Label>
        <Input 
          type="number" 
          id="numEmployees" 
          value={numEmployees}
          onChange={(e) => setNumEmployees(Number(e.target.value))}
          min={1}
          max={20}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input 
            type="date" 
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input 
            type="date" 
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Registrations per Employee ({numRegistrations[0]})</Label>
        <Slider
          value={numRegistrations}
          onValueChange={setNumRegistrations}
          min={20}
          max={150}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Work Start Time Range ({workStartRange[0]}-{workStartRange[1]} AM)</Label>
        <Slider
          value={workStartRange}
          onValueChange={setWorkStartRange}
          min={7}
          max={9}
          step={0.5}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Work End Time Range ({workEndRange[0]-12}-{workEndRange[1]-12} PM)</Label>
        <Slider
          value={workEndRange}
          onValueChange={setWorkEndRange}
          min={16}
          max={18}
          step={0.5}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Break Duration Range ({breakDurationRange[0]}-{breakDurationRange[1]} hours)</Label>
        <Slider
          value={breakDurationRange}
          onValueChange={setBreakDurationRange}
          min={0.5}
          max={2}
          step={0.5}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="skipWeekends"
          checked={skipWeekends}
          onCheckedChange={setSkipWeekends}
        />
        <Label htmlFor="skipWeekends">Skip Weekends</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="randomizeAssignments"
          checked={randomizeAssignments}
          onCheckedChange={setRandomizeAssignments}
        />
        <Label htmlFor="randomizeAssignments">Randomize Project & Work Category Assignments</Label>
      </div>

      <Button type="submit" className="w-full">Generate Dataset</Button>
    </form>
  );
};
