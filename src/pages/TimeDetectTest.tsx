import { useState } from "react";
import { Button } from "@/components/ui/button";
import { timeDetectService } from "@/services/timeDetectService";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DatasetState, INITIAL_DATASET_STATE } from "@/stores/datasetStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

const TimeDetectTest = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingUrl, setIsGettingUrl] = useState(false);

  const { data: dataset = INITIAL_DATASET_STATE } = useQuery<DatasetState>({
    queryKey: ['dataset'],
    initialData: INITIAL_DATASET_STATE,
  });

  const { data: jobs = [], refetch: refetchJobs } = useQuery({
    queryKey: ['timedetect-jobs'],
    queryFn: () => timeDetectService.getTimeDetectJobs(),
  });

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const isConnected = await timeDetectService.testConnection();
      toast({
        title: isConnected ? "Connection Successful" : "Connection Failed",
        description: isConnected 
          ? "Successfully connected to TimeDetect service" 
          : "Failed to connect to TimeDetect service",
        variant: isConnected ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">TimeDetect Connection Test</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          {dataset.registrations.length > 0 && (
            <div className="text-gray-600 mb-4">
              Dataset with {dataset.registrations.length} registrations
            </div>
          )}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Test Connection</h2>
              <p className="text-gray-600 mb-4">
                Test the connection to the TimeDetect service by clicking the button below.
              </p>
              <Button 
                onClick={handleTestConnection} 
                disabled={isLoading}
              >
                {isLoading ? "Testing..." : "Test Connection"}
              </Button>
            </div>

            <div className="border-t pt-4">
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
                <h2 className="text-lg font-semibold">TimeDetect Jobs</h2>
                <Button
                  onClick={handleRefreshJobs}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Jobs
                </Button>
              </div>
              <ScrollArea className="h-[400px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Dataset ID</TableHead>
                      <TableHead>Customer ID</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Completed At</TableHead>
                      <TableHead className="max-w-[300px]">Presigned URL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.job_id}</TableCell>
                        <TableCell>{job.status || 'pending'}</TableCell>
                        <TableCell>{job.dataset_id}</TableCell>
                        <TableCell>{job.customer_id}</TableCell>
                        <TableCell>{formatDate(job.created_at)}</TableCell>
                        <TableCell>
                          {job.completed_at ? formatDate(job.completed_at) : '-'}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate" title={job.presigned_url}>
                          {job.presigned_url}
                        </TableCell>
                      </TableRow>
                    ))}
                    {jobs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No jobs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDetectTest;