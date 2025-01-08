import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface AnomalySettingsSectionProps {
  anomalyType: "none" | "weak" | "strong" | "both";
  setAnomalyType: (value: "none" | "weak" | "strong" | "both") => void;
  anomalyProbability: number[];
  setAnomalyProbability: (value: number[]) => void;
}

export const AnomalySettingsSection = ({
  anomalyType,
  setAnomalyType,
  anomalyProbability,
  setAnomalyProbability,
}: AnomalySettingsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Anomaly Type</Label>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="none" 
              checked={anomalyType === "none"}
              onCheckedChange={() => setAnomalyType("none")}
            />
            <Label htmlFor="none">No Anomalies</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="weak" 
              checked={anomalyType === "weak"}
              onCheckedChange={() => setAnomalyType("weak")}
            />
            <Label htmlFor="weak">Weak Anomalies Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="strong" 
              checked={anomalyType === "strong"}
              onCheckedChange={() => setAnomalyType("strong")}
            />
            <Label htmlFor="strong">Strong Anomalies Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="both" 
              checked={anomalyType === "both"}
              onCheckedChange={() => setAnomalyType("both")}
            />
            <Label htmlFor="both">Both Weak and Strong Anomalies (50/50 chance)</Label>
          </div>
        </div>
      </div>

      {anomalyType !== "none" && (
        <div className="space-y-2">
          <Label>Anomaly Probability ({(anomalyProbability[0] * 100).toFixed(0)}%)</Label>
          <Slider
            value={anomalyProbability}
            onValueChange={setAnomalyProbability}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};