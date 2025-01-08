import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface TimeSettingsSectionProps {
  workStartRange: number[];
  setWorkStartRange: (value: number[]) => void;
  workEndRange: number[];
  setWorkEndRange: (value: number[]) => void;
  breakDurationRange: number[];
  setBreakDurationRange: (value: number[]) => void;
  skipWeekends: boolean;
  setSkipWeekends: (value: boolean) => void;
  randomizeAssignments: boolean;
  setRandomizeAssignments: (value: boolean) => void;
}

export const TimeSettingsSection = ({
  workStartRange,
  setWorkStartRange,
  workEndRange,
  setWorkEndRange,
  breakDurationRange,
  setBreakDurationRange,
  skipWeekends,
  setSkipWeekends,
  randomizeAssignments,
  setRandomizeAssignments,
}: TimeSettingsSectionProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};