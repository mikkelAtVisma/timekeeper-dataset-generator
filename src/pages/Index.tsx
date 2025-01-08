import { useState } from "react";
import { TimeRegistration } from "../types/timeRegistration";
import { TimeRegistrationTable } from "../components/TimeRegistrationTable";
import { TimeRegistrationCalendar } from "../components/TimeRegistrationCalendar";
import { DatasetGenerationForm } from "../components/DatasetGenerationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<TimeRegistration[]>([]);
  const [selectedRegistrationId, setSelectedRegistrationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");
  const [clearTrigger, setClearTrigger] = useState(0);

  const handleGenerateDataset = (newRegistrations: TimeRegistration[]) => {
    setRegistrations((prev) => [...newRegistrations, ...prev]);
  };

  const handleRegistrationClick = (registration: TimeRegistration, targetView: "list" | "calendar") => {
    setSelectedRegistrationId(registration.registrationId);
    setActiveTab(targetView);
  };

  const handleClearDataset = () => {
    setRegistrations([]);
    setSelectedRegistrationId(null);
    setClearTrigger(prev => prev + 1);
    toast({
      title: "Dataset cleared",
      description: "All registrations and patterns have been removed",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Time Registration</h1>
          {registrations.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={handleClearDataset}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Dataset
            </Button>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <h2 className="text-xl font-semibold">Dataset Generation</h2>
          <DatasetGenerationForm 
            onGenerate={handleGenerateDataset} 
            onClear={clearTrigger > 0 ? () => {} : undefined}
          />
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