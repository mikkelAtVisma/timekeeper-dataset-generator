import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface BasicSettingsSectionProps {
  numEmployees: number;
  setNumEmployees: (value: number) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  numRegistrations: number[];
  setNumRegistrations: (value: number[]) => void;
}

export const BasicSettingsSection = ({
  numEmployees,
  setNumEmployees,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  numRegistrations,
  setNumRegistrations,
}: BasicSettingsSectionProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};