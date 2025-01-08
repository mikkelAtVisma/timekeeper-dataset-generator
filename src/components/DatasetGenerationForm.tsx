import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { TimeRegistration } from "../types/timeRegistration";
import { Switch } from "@/components/ui/switch";

interface DatasetGenerationFormProps {
  onGenerate: (registrations: TimeRegistration[]) => void;
}

export const DatasetGenerationForm = ({ onGenerate }: DatasetGenerationFormProps) => {
  const { toast } = useToast();
  const [numEmployees, setNumEmployees] = useState(5);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projects] = useState(["A", "B", "C", "D"]);
  const [workCategories] = useState(["Development", "Testing", "Meetings", "Documentation"]);
  const [departments] = useState(["HR", "IT", "Sales", "Marketing"]);
  const [numericals] = useState(["productivity", "quality", "satisfaction"]);
  const [numRegistrations, setNumRegistrations] = useState([35]);
  
  // New state variables for additional controls
  const [workStartRange, setWorkStartRange] = useState([7, 9]); // 7-9 AM
  const [workEndRange, setWorkEndRange] = useState([16, 18]); // 4-6 PM
  const [breakDurationRange, setBreakDurationRange] = useState([0.5, 2]); // 0.5-2 hours
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [randomizeAssignments, setRandomizeAssignments] = useState(true);
  const [useEmployeeNumericals, setUseEmployeeNumericals] = useState(true);

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
      numericals,
      numRegistrationsPerEmployee: numRegistrations[0],
      workStartRange,
      workEndRange,
      breakDurationRange,
      skipWeekends,
      randomizeAssignments,
      useEmployeeNumericals,
    });

    onGenerate(registrations);
    
    toast({
      title: "Success",
      description: "Dataset generated successfully",
    });
  };

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

      <div className="flex items-center space-x-2">
        <Switch
          id="useEmployeeNumericals"
          checked={useEmployeeNumericals}
          onCheckedChange={setUseEmployeeNumericals}
        />
        <Label htmlFor="useEmployeeNumericals">Use Employee-specific Numericals</Label>
      </div>

      <Button type="submit" className="w-full">Generate Dataset</Button>
    </form>
  );
};

interface GenerateDatasetParams {
  numEmployees: number;
  startDate: string;
  endDate: string;
  projects: string[];
  workCategories: string[];
  departments: string[];
  numericals: string[];
  numRegistrationsPerEmployee: number;
  workStartRange: number[];
  workEndRange: number[];
  breakDurationRange: number[];
  skipWeekends: boolean;
  randomizeAssignments: boolean;
  useEmployeeNumericals: boolean;
}

const generateDataset = ({
  numEmployees,
  startDate,
  endDate,
  projects,
  workCategories,
  departments,
  numericals,
  numRegistrationsPerEmployee,
  workStartRange,
  workEndRange,
  breakDurationRange,
  skipWeekends,
  randomizeAssignments,
  useEmployeeNumericals,
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

  // Pre-generate employee numericals if using employee-specific values
  const employeeNumericalsList = Array.from({ length: numEmployees }, () => {
    if (!useEmployeeNumericals) return [];
    
    const numNumericals = Math.floor(Math.random() * 3) + 1;
    return numericals
      .slice(0, numNumericals)
      .map(name => ({
        name,
        value: Math.floor(Math.random() * 100),
      }));
  });

  // Generate registrations for each employee
  for (let empIdx = 0; empIdx < numEmployees; empIdx++) {
    const employeeId = `employee-${empIdx}`;
    const departmentId = departments[empIdx % departments.length];
    
    // Use pre-generated numericals or generate new ones
    const employeeNumericals = employeeNumericalsList[empIdx];

    // Generate registrations
    for (let i = 0; i < numRegistrationsPerEmployee; i++) {
      const date = dateRange[Math.floor(Math.random() * dateRange.length)];
      
      const startTime = workStartRange[0] + Math.random() * (workStartRange[1] - workStartRange[0]);
      const endTime = workEndRange[0] + Math.random() * (workEndRange[1] - workEndRange[0]);
      const breakDuration = breakDurationRange[0] + 
        Math.random() * (breakDurationRange[1] - breakDurationRange[0]);
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
        numericals: useEmployeeNumericals ? 
          employeeNumericals : 
          numericals.slice(0, Math.floor(Math.random() * 3) + 1)
            .map(name => ({
              name,
              value: Math.floor(Math.random() * 100),
            })),
        anomaly: 0,
      });
    }
  }

  return registrations;
};