import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TimeRegistration, EmployeeWorkPattern } from "../types/timeRegistration";
import { startOfWeek, addMonths, format } from "date-fns";
import { BasicSettingsSection } from "./dataset-generation/BasicSettingsSection";
import { TimeSettingsSection } from "./dataset-generation/TimeSettingsSection";
import { AnomalySettingsSection } from "./dataset-generation/AnomalySettingsSection";
import { WorkPatternSettingsSection } from "./dataset-generation/WorkPatternSettingsSection";
import { generateDataset } from "../utils/datasetGenerator";
import { EmployeePatternVisualization } from "./EmployeePatternVisualization";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { INITIAL_DATASET_STATE, persistDataset } from "@/stores/datasetStore";

const getInitialStartDate = () => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  return format(monday, 'yyyy-MM-dd');
};

const getInitialEndDate = () => {
  const monday = startOfWeek(new Date(), { weekStartsOn: 1 });
  const monthLater = addMonths(monday, 1);
  return format(monthLater, 'yyyy-MM-dd');
};

interface DatasetGenerationFormProps {
  onGenerate: (registrations: TimeRegistration[], startDate: string, endDate: string) => void;
  clearTrigger?: number;
}

export const DatasetGenerationForm = ({ onGenerate, clearTrigger }: DatasetGenerationFormProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [numEmployees, setNumEmployees] = useState(5);
  const [startDate, setStartDate] = useState(getInitialStartDate());
  const [endDate, setEndDate] = useState(getInitialEndDate());
  const [projects] = useState(["A", "B", "C", "D"]);
  const [workCategories] = useState(["Development", "Testing", "Meetings", "Documentation"]);
  const [departments] = useState(["HR", "IT", "Sales", "Marketing"]);
  const [numRegistrations, setNumRegistrations] = useState([35]);
  
  // Pattern state management - single source of truth
  const [patternCache, setPatternCache] = useState<Map<string, EmployeeWorkPattern>>(new Map());
  
  // Work Pattern settings
  const [numDepartments, setNumDepartments] = useState([1]);
  const [numStartTimes, setNumStartTimes] = useState([1]);
  const [numEndTimes, setNumEndTimes] = useState([1]);
  const [numBreakDurations, setNumBreakDurations] = useState([1]);
  const [numWorkCategories, setNumWorkCategories] = useState([1]);
  const [minWeekendWorkers, setMinWeekendWorkers] = useState([1]);
  
  // Time settings
  const [workStartRange, setWorkStartRange] = useState([7, 9]);
  const [workEndRange, setWorkEndRange] = useState([16, 18]);
  const [breakDurationRange, setBreakDurationRange] = useState([0.5, 2]);
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [randomizeAssignments, setRandomizeAssignments] = useState(true);

  // Anomaly settings
  const [anomalyType, setAnomalyType] = useState<"none" | "weak" | "strong" | "both">("none");
  const [anomalyProbability, setAnomalyProbability] = useState([0.33]);

  // Query to load the dataset with proper caching
  const { data: dataset } = useQuery({
    queryKey: ['dataset'],
    queryFn: () => INITIAL_DATASET_STATE,
    initialData: INITIAL_DATASET_STATE,
    staleTime: Infinity,
    gcTime: Infinity
  });

  // Memoize pattern extraction
  const extractedPatterns = useMemo(() => {
    if (!dataset?.registrations.length) return new Map<string, EmployeeWorkPattern>();
    
    const patterns = new Map<string, EmployeeWorkPattern>();
    const processedEmployees = new Set<string>();
    
    dataset.registrations.forEach(reg => {
      if (!processedEmployees.has(reg.employeeId)) {
        processedEmployees.add(reg.employeeId);
        
        const employeeRegs = dataset.registrations.filter(r => r.employeeId === reg.employeeId);
        if (employeeRegs.length > 0) {
          patterns.set(reg.employeeId, {
            employeeId: reg.employeeId,
            departmentId: reg.departmentId,
            allowedStartTimes: [...new Set(employeeRegs.map(r => r.startTime))],
            allowedEndTimes: [...new Set(employeeRegs.map(r => r.endTime))],
            allowedBreakDurations: [...new Set(employeeRegs.map(r => r.breakDuration))],
            allowedWorkCategories: [...new Set(employeeRegs.map(r => r.workCategory))],
            canWorkWeekends: employeeRegs.some(r => {
              const date = new Date(r.date);
              return date.getDay() === 0 || date.getDay() === 6;
            })
          });
        }
      }
    });
    
    return patterns;
  }, [dataset?.registrations]);

  // Load dataset and patterns only once when component mounts or when dataset changes
  useEffect(() => {
    if (dataset && dataset.registrations.length > 0) {
      setPatternCache(extractedPatterns);
      
      if (dataset.startDate) setStartDate(dataset.startDate);
      if (dataset.endDate) setEndDate(dataset.endDate);
      
      onGenerate(dataset.registrations, dataset.startDate, dataset.endDate);
    }
  }, [dataset, onGenerate, extractedPatterns]);

  // Add a new effect for clearTrigger
  useEffect(() => {
    if (clearTrigger && clearTrigger > 0) {
      setPatternCache(new Map());
    }
  }, [clearTrigger]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      toast({
        title: "Error",
        description: "Start date must be before end date",
        variant: "destructive",
      });
      return;
    }

    // Generate data using the parameters and cached patterns
    const { registrations, patterns } = generateDataset({
      numEmployees,
      startDate,
      endDate,
      projects,
      workCategories,
      departments,
      numRegistrationsPerEmployee: numRegistrations[0],
      workStartRange,
      workEndRange,
      breakDurationRange,
      skipWeekends,
      randomizeAssignments,
      anomalyConfig: {
        type: anomalyType,
        probability: anomalyProbability[0]
      },
      existingPatterns: patternCache,
      workPatternConfig: {
        numDepartments: numDepartments[0],
        numStartTimes: numStartTimes[0],
        numEndTimes: numEndTimes[0],
        numBreakDurations: numBreakDurations[0],
        numWorkCategories: numWorkCategories[0],
        minWeekendWorkers: minWeekendWorkers[0]
      }
    });

    // Update pattern cache with new patterns
    const newCache = new Map(patternCache);
    patterns.forEach(pattern => {
      newCache.set(pattern.employeeId, pattern);
    });
    setPatternCache(newCache);
    
    const newDataset = {
      registrations,
      startDate,
      endDate,
    };
    
    // Update global dataset state
    queryClient.setQueryData(['dataset'], newDataset);
    
    // Persist the dataset
    persistDataset(newDataset);
    
    onGenerate(registrations, startDate, endDate);
    
    toast({
      title: "Success",
      description: "Dataset generated successfully",
    });
  };

  // Convert pattern cache to array for visualization
  const patternsArray = Array.from(patternCache.values());

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Basic Settings</h3>
          <BasicSettingsSection
            numEmployees={numEmployees}
            setNumEmployees={setNumEmployees}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            numRegistrations={numRegistrations}
            setNumRegistrations={setNumRegistrations}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Work Pattern Settings</h3>
          <WorkPatternSettingsSection
            numDepartments={numDepartments}
            setNumDepartments={setNumDepartments}
            numStartTimes={numStartTimes}
            setNumStartTimes={setNumStartTimes}
            numEndTimes={numEndTimes}
            setNumEndTimes={setNumEndTimes}
            numBreakDurations={numBreakDurations}
            setNumBreakDurations={setNumBreakDurations}
            numWorkCategories={numWorkCategories}
            setNumWorkCategories={setNumWorkCategories}
            minWeekendWorkers={minWeekendWorkers}
            setMinWeekendWorkers={setMinWeekendWorkers}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Time Settings</h3>
          <TimeSettingsSection
            workStartRange={workStartRange}
            setWorkStartRange={setWorkStartRange}
            workEndRange={workEndRange}
            setWorkEndRange={setWorkEndRange}
            breakDurationRange={breakDurationRange}
            setBreakDurationRange={setBreakDurationRange}
            skipWeekends={skipWeekends}
            setSkipWeekends={setSkipWeekends}
            randomizeAssignments={randomizeAssignments}
            setRandomizeAssignments={setRandomizeAssignments}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Anomaly Settings</h3>
          <AnomalySettingsSection
            anomalyType={anomalyType}
            setAnomalyType={setAnomalyType}
            anomalyProbability={anomalyProbability}
            setAnomalyProbability={setAnomalyProbability}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Generate Dataset</Button>

      {patternsArray.length > 0 && (
        <div className="mt-6">
          <EmployeePatternVisualization patterns={patternsArray} />
        </div>
      )}
    </form>
  );
};
