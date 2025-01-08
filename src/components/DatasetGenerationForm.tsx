import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { TimeRegistration } from "../types/timeRegistration";

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
}: GenerateDatasetParams): TimeRegistration[] => {
  const registrations: TimeRegistration[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateRange = [];
  
  // Generate date range
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dateRange.push(new Date(d));
  }

  // Generate registrations for each employee
  for (let empIdx = 0; empIdx < numEmployees; empIdx++) {
    const employeeId = `employee-${empIdx}`;
    const departmentId = departments[empIdx % departments.length];
    
    // Generate employee numericals
    const employeeNumericals = numericals
      .slice(0, Math.floor(Math.random() * 3) + 1)
      .map(name => ({
        name,
        value: Math.floor(Math.random() * 100),
      }));

    // Generate registrations
    for (let i = 0; i < numRegistrationsPerEmployee; i++) {
      const date = dateRange[Math.floor(Math.random() * dateRange.length)];
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const startTime = 7 + Math.floor(Math.random() * 2); // 7-9 AM
      const endTime = 16 + Math.floor(Math.random() * 2); // 4-6 PM
      const breakDuration = 0.5 + Math.floor(Math.random() * 3) * 0.5; // 0.5-2 hours
      const workDuration = endTime - startTime - breakDuration;

      registrations.push({
        registrationId: `reg-${registrations.length}`,
        date: date.toISOString().split('T')[0],
        employeeId,
        projectId: projects[Math.floor(Math.random() * projects.length)],
        departmentId,
        workCategory: workCategories[Math.floor(Math.random() * workCategories.length)],
        startTime,
        endTime,
        workDuration,
        breakDuration,
        publicHoliday: Math.random() > 0.9,
        numericals: employeeNumericals,
        anomaly: 0,
      });
    }
  }

  return registrations;
};