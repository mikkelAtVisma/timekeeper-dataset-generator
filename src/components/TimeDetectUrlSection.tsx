import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { timeDetectService } from "@/services/timeDetectService";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TimeDetectJobsTable } from "@/components/TimeDetectJobsTable";

export const TimeDetectUrlSection = () => {
  const { toast } = useToast();
  const [isGettingUrl, setIsGettingUrl] = useState(false);

  const { data: jobs = [], refetch: refetchJobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['timedetect-jobs'],
    queryFn: () => timeDetectService.getTimeDetectJobs(),
    refetchOnWindowFocus: true,
  });

  const handleGetPresignedUrl = async () => {
    setIsGettingUrl(true);
    try {
      const response = await timeDetectService.getPresignedUrl();
      await refetchJobs();
      toast({
        title: "Presigned URL Generated",
        description: `Job ID: ${response.jobId}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get presigned URL",
        variant: "destructive",
      });
    } finally {
      setIsGettingUrl(false);
    }
  };

  const handleRefreshJobs = async () => {
    try {
      await refetchJobs();
      toast({
        title: "Jobs Refreshed",
        description: "TimeDetect jobs list has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh jobs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-2">Get Presigned URL</h2>
        <p className="text-gray-600 mb-4">
          Generate a presigned URL for uploading data to TimeDetect.
        </p>
        <Button 
          onClick={handleGetPresignedUrl} 
          disabled={isGettingUrl}
          variant="secondary"
        >
          {isGettingUrl ? "Generating..." : "Get Presigned URL"}
        </Button>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={handleRefreshJobs}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isLoadingJobs}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingJobs ? 'animate-spin' : ''}`} />
            {isLoadingJobs ? 'Refreshing...' : 'Refresh Jobs'}
          </Button>
        </div>
        <TimeDetectJobsTable jobs={jobs} isLoading={isLoadingJobs} />
      </div>
    </div>
  );
};