import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface AnomalySettingsSectionProps {
  anomalyType: "none" | "weak" | "strong";
  setAnomalyType: (value: "none" | "weak" | "strong") => void;
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
      <div>
        <Label>Anomaly Type</Label>
        <RadioGroup
          value={anomalyType}
          onValueChange={(value) => setAnomalyType(value as "none" | "weak" | "strong")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">No Anomalies</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weak" id="weak" />
            <Label htmlFor="weak">Weak Anomalies</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="strong" id="strong" />
            <Label htmlFor="strong">Strong Anomalies</Label>
          </div>
        </RadioGroup>
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