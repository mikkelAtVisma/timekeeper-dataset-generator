import { useState } from "react";
import { TimeRegistration } from "../types/timeRegistration";
import { TimeRegistrationTable } from "../components/TimeRegistrationTable";
import { TimeRegistrationCalendar } from "../components/TimeRegistrationCalendar";
import { DatasetGenerationForm } from "../components/DatasetGenerationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [registrations, setRegistrations] = useState<TimeRegistration[]>([]);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  const handleGenerateDataset = (newRegistrations: TimeRegistration[]) => {
    setRegistrations((prev) => [...newRegistrations, ...prev]);
  };

  const handleRegistrationClick = (registration: TimeRegistration, targetView: "list" | "calendar") => {
    setSelectedRegistrationId(registration.registrationId);
    setActiveTab(targetView);
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
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Registrations</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <TimeRegistrationTable 
                registrations={registrations} 
                selectedRegistrationId={selectedRegistrationId}
                onRegistrationClick={(registration) => handleRegistrationClick(registration, "calendar")}
              />
            </TabsContent>
            <TabsContent value="calendar">
              <TimeRegistrationCalendar 
                registrations={registrations}
                selectedRegistrationId={selectedRegistrationId}
                onRegistrationClick={(registration) => handleRegistrationClick(registration, "list")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;