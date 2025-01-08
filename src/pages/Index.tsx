import { useState } from "react";
import { TimeRegistration } from "../types/timeRegistration";
import { TimeRegistrationTable } from "../components/TimeRegistrationTable";
import { TimeRegistrationCalendar } from "../components/TimeRegistrationCalendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { DatasetGenerationForm } from "../components/DatasetGenerationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [registrations, setRegistrations] = useState<TimeRegistration[]>([]);
  const [anomalyType, setAnomalyType] = useState<"none" | "weak" | "strong">("none");
  const [anomalyProbability, setAnomalyProbability] = useState([0.33]);

  const handleGenerateDataset = (newRegistrations: TimeRegistration[]) => {
    setRegistrations((prev) => [...newRegistrations, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Time Registration</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">Dataset Generation</h2>
          <DatasetGenerationForm onGenerate={handleGenerateDataset} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">Sample Data Generation</h2>
          
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
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Registrations</h2>
          <Tabs defaultValue="list" className="w-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <TimeRegistrationTable registrations={registrations} />
            </TabsContent>
            <TabsContent value="calendar">
              <TimeRegistrationCalendar registrations={registrations} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;