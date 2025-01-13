import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TimeDetectUploadSection = () => {
  const { toast } = useToast();
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: jobs = [] } = useQuery({
    queryKey: ['timedetect-jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timedetect_jobs')
        .select('*')
        .eq('status', 'ready_to_upload')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: datasets = [] } = useQuery({
    queryKey: ['datasets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleUpload = async () => {
    if (!selectedJobId || !selectedDatasetId) {
      toast({
        title: "Missing selection",
        description: "Please select both a job and a dataset",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { error } = await supabase.functions.invoke('timedetect-upload', {
        body: { jobId: selectedJobId, datasetId: selectedDatasetId }
      });

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: "The dataset has been uploaded to TimeDetect",
      });

      // Reset selections
      setSelectedJobId("");
      setSelectedDatasetId("");
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload dataset to TimeDetect",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upload to TimeDetect</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Job</label>
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a job" />
            </SelectTrigger>
            <SelectContent>
              {jobs.map((job) => (
                <SelectItem key={job.job_id} value={job.job_id}>
                  {job.job_id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Dataset</label>
          <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasets.map((dataset) => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  Dataset {dataset.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={isUploading || !selectedJobId || !selectedDatasetId}
        >
          {isUploading ? "Uploading..." : "Upload to TimeDetect"}
        </Button>
      </div>
    </div>
  );
};