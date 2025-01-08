import { useState } from "react";
import { TimeRegistration } from "../types/timeRegistration";
import { TimeRegistrationForm } from "../components/TimeRegistrationForm";
import { TimeRegistrationTable } from "../components/TimeRegistrationTable";
import { Button } from "@/components/ui/button";
import { generateSampleData } from "../utils/generateData";

const Index = () => {
  const [registrations, setRegistrations] = useState<TimeRegistration[]>([]);

  const handleSubmit = (registration: TimeRegistration) => {
    setRegistrations((prev) => [registration, ...prev]);
  };

  const handleGenerateData = () => {
    const sampleData = generateSampleData(5);
    setRegistrations((prev) => [...sampleData, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Time Registration</h1>
          <Button onClick={handleGenerateData}>Generate Sample Data</Button>
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