import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface WorkPatternSettingsSectionProps {
  numDepartments: number[];
  setNumDepartments: (value: number[]) => void;
  numStartTimes: number[];
  setNumStartTimes: (value: number[]) => void;
  numEndTimes: number[];
  setNumEndTimes: (value: number[]) => void;
  numBreakDurations: number[];
  setNumBreakDurations: (value: number[]) => void;
}

export const WorkPatternSettingsSection = ({
  numDepartments,
  setNumDepartments,
  numStartTimes,
  setNumStartTimes,
  numEndTimes,
  setNumEndTimes,
  numBreakDurations,
  setNumBreakDurations,
}: WorkPatternSettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Number of Departments ({numDepartments[0]})</Label>
        <Slider
          value={numDepartments}
          onValueChange={setNumDepartments}
          min={1}
          max={4}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Number of Start Times ({numStartTimes[0]})</Label>
        <Slider
          value={numStartTimes}
          onValueChange={setNumStartTimes}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Number of End Times ({numEndTimes[0]})</Label>
        <Slider
          value={numEndTimes}
          onValueChange={setNumEndTimes}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label>Number of Break Durations ({numBreakDurations[0]})</Label>
        <Slider
          value={numBreakDurations}
          onValueChange={setNumBreakDurations}
          min={1}
          max={4}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};