import { useState } from "react";
import { TimeRegistration } from "../types/timeRegistration";
import { TimeRegistrationForm } from "../components/TimeRegistrationForm";
import { TimeRegistrationTable } from "../components/TimeRegistrationTable";
import { Button } from "@/components/ui/button";
import { generateSampleData } from "../utils/generateData";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const [registrations, setRegistrations] = useState<TimeRegistration[]>([]);
  const [anomalyType, setAnomalyType] = useState<"none" | "weak" | "strong">("none");
  const [anomalyProbability, setAnomalyProbability] = useState([0.33]); // Default to 33%

  const handleSubmit = (registration: TimeRegistration) => {
    setRegistrations((prev) => [registration, ...prev]);
  };

  const handleGenerateData = () => {
    const includeAnomalies = anomalyType !== "none";
    const sampleData = generateSampleData(5, includeAnomalies, {
      type: anomalyType,
      probability: anomalyProbability[0]
    });
    setRegistrations((prev) => [...sampleData, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Time Registration</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">Data Generation Controls</h2>
          
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
                  className="w-[60%]"
                />
              </div>
            )}

            <Button onClick={handleGenerateData} className="mt-4">
              Generate Data
            </Button>
          </div>
        </div>
        
        <TimeRegistrationForm onSubmit={handleSubmit} />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Registrations</h2>
          <TimeRegistrationTable registrations={registrations} />
        </div>
      </div>
    </div>
  );
};

export default Index;