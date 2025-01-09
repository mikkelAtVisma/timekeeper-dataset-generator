import { useState } from "react";
import { TimeRegistration } from "../types/timeRegistration";
import { TimeRegistrationTable } from "../components/TimeRegistrationTable";
import { TimeRegistrationCalendar } from "../components/TimeRegistrationCalendar";
import { DatasetGenerationForm } from "../components/DatasetGenerationForm";
import { GeneratePromptButton } from "../components/GeneratePromptButton";
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
  const [currentStartDate, setCurrentStartDate] = useState("");
  const [currentEndDate, setCurrentEndDate] = useState("");
  const [currentSettings, setCurrentSettings] = useState({
    numEmployees: 5,
    projects: ["A", "B", "C", "D"],
    workCategories: ["Development", "Testing", "Meetings", "Documentation"],
    departments: ["HR", "IT", "Sales", "Marketing"],
    numRegistrations: [35],
    workStartRange: [7, 9],
    workEndRange: [16, 18],
    breakDurationRange: [0.5, 2],
    skipWeekends: true,
    randomizeAssignments: true,
    workPatternConfig: {
      numDepartments: 1,
      numStartTimes: 1,
      numEndTimes: 1,
      numBreakDurations: 1,
      numWorkCategories: 1,
      minWeekendWorkers: 1
    }
  });

  const handleGenerateDataset = (newRegistrations: TimeRegistration[], startDate: string, endDate: string) => {
    setRegistrations((prev) => [...newRegistrations, ...prev]);
    setCurrentStartDate(startDate);
    setCurrentEndDate(endDate);
  };

  const handleRegistrationClick = (registration: TimeRegistration, targetView: "list" | "calendar") => {
    setSelectedRegistrationId(registration.registrationId);
    setActiveTab(targetView);
  };

  const handleClearDataset = () => {
    setRegistrations([]);
    setSelectedRegistrationId(null);
    setClearTrigger(prev => prev + 1);
    setCurrentStartDate("");
    setCurrentEndDate("");
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
          <div className="flex gap-2">
            <GeneratePromptButton 
              onGenerateDataset={handleGenerateDataset}
              currentSettings={currentSettings}
            />
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
                startDate={currentStartDate}
                endDate={currentEndDate}
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