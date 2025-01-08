import { useState } from "react";
import { TimeRegistration } from "../types/timeRegistration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface TimeRegistrationFormProps {
  onSubmit: (data: TimeRegistration) => void;
}

export const TimeRegistrationForm = ({ onSubmit }: TimeRegistrationFormProps) => {
  const { toast } = useToast();
  const [numericalName, setNumericalName] = useState("");
  const [numericalValue, setNumericalValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const startTime = Number(formData.get("startTime"));
    const endTime = Number(formData.get("endTime"));
    const breakDuration = Number(formData.get("breakDuration"));
    const workDuration = endTime - startTime - breakDuration;

    if (workDuration <= 0) {
      toast({
        title: "Invalid time entries",
        description: "Work duration must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    const registration: TimeRegistration = {
      registrationId: `reg-${Math.floor(Math.random() * 10000)}`,
      date: formData.get("date") as string,
      employeeId: formData.get("employeeId") as string,
      projectId: formData.get("projectId") as string,
      departmentId: formData.get("departmentId") as string,
      workCategory: formData.get("workCategory") as string,
      startTime,
      endTime,
      workDuration,
      breakDuration,
      publicHoliday: formData.get("publicHoliday") === "on",
      numericals: numericalName && numericalValue ? [
        {
          name: numericalName,
          value: Number(numericalValue),
        },
      ] : [],
    };

    onSubmit(registration);
    e.currentTarget.reset();
    setNumericalName("");
    setNumericalValue("");
    
    toast({
      title: "Success",
      description: "Time registration added successfully",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" name="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input type="text" id="employeeId" name="employeeId" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectId">Project ID</Label>
          <Input type="text" id="projectId" name="projectId" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="departmentId">Department ID</Label>
          <Input type="text" id="departmentId" name="departmentId" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="workCategory">Work Category</Label>
          <Input type="text" id="workCategory" name="workCategory" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time (24h)</Label>
          <Input type="number" id="startTime" name="startTime" min="0" max="24" step="0.5" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time (24h)</Label>
          <Input type="number" id="endTime" name="endTime" min="0" max="24" step="0.5" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="breakDuration">Break Duration (hours)</Label>
          <Input type="number" id="breakDuration" name="breakDuration" min="0" max="24" step="0.5" required />
        </div>
      </div>

      <div className="flex items-center space-x-2 py-4">
        <Switch id="publicHoliday" name="publicHoliday" />
        <Label htmlFor="publicHoliday">Public Holiday</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numericalName">Numerical Name</Label>
          <Input 
            type="text" 
            id="numericalName" 
            value={numericalName}
            onChange={(e) => setNumericalName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numericalValue">Numerical Value</Label>
          <Input 
            type="number" 
            id="numericalValue" 
            value={numericalValue}
            onChange={(e) => setNumericalValue(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Submit Registration</Button>
    </form>
  );
};