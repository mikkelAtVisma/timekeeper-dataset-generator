import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { DatasetState, INITIAL_DATASET_STATE } from "@/stores/datasetStore";
import { DatasetsTable } from "@/components/DatasetsTable";
import { Json } from "@/integrations/supabase/types";

export const DatasetSection = () => {
  const { toast } = useToast();
  const [isSavingDataset, setIsSavingDataset] = useState(false);

  const { data: dataset = INITIAL_DATASET_STATE } = useQuery<DatasetState>({
    queryKey: ['dataset'],
    initialData: INITIAL_DATASET_STATE,
  });

  const handleSaveDataset = async () => {
    if (!dataset.registrations.length) {
      toast({
        title: "No data to save",
        description: "Please generate a dataset first",
        variant: "destructive",
      });
      return;
    }

    setIsSavingDataset(true);
    try {
      const serializedRegistrations = dataset.registrations.map(reg => {
        const serializedPattern = reg.employeePattern ? {
          employeeId: reg.employeePattern.employeeId,
          allowedStartTimes: reg.employeePattern.allowedStartTimes,
          allowedEndTimes: reg.employeePattern.allowedEndTimes,
          allowedBreakDurations: reg.employeePattern.allowedBreakDurations,
          departmentId: reg.employeePattern.departmentId,
          allowedWorkCategories: reg.employeePattern.allowedWorkCategories,
          canWorkWeekends: reg.employeePattern.canWorkWeekends
        } : null;

        const serializedNumericals = (reg.numericals || []).map(num => ({
          name: num.name,
          value: num.value
        }));

        return {
          registrationId: reg.registrationId,
          date: reg.date,
          employeeId: reg.employeeId,
          projectId: reg.projectId,
          departmentId: reg.departmentId,
          workCategory: reg.workCategory,
          startTime: reg.startTime,
          endTime: reg.endTime,
          workDuration: reg.workDuration,
          breakDuration: reg.breakDuration,
          publicHoliday: reg.publicHoliday || false,
          numericals: serializedNumericals,
          anomaly: reg.anomaly || null,
          anomalyField: reg.anomalyField || null,
          employeePattern: serializedPattern
        };
      }) as Json;

      const { error } = await supabase
        .from('datasets')
        .insert({
          registrations: serializedRegistrations,
          start_date: dataset.startDate,
          end_date: dataset.endDate,
        });

      if (error) throw error;

      toast({
        title: "Dataset saved",
        description: "The dataset has been saved successfully",
      });
    } catch (error) {
      console.error('Error saving dataset:', error);
      toast({
        title: "Error",
        description: "Failed to save the dataset",
        variant: "destructive",
      });
    } finally {
      setIsSavingDataset(false);
    }
  };

  return (
    <div className="space-y-6">
      {dataset.registrations.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-gray-600">
            Dataset with {dataset.registrations.length} registrations
          </div>
          <Button 
            onClick={handleSaveDataset} 
            disabled={isSavingDataset}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSavingDataset ? "Saving..." : "Save Dataset"}
          </Button>
        </div>
      )}
      
      <DatasetsTable />
    </div>
  );
};