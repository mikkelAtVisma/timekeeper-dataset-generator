import { useState } from "react";
import { Button } from "@/components/ui/button";
import { timeDetectService } from "@/services/timeDetectService";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DatasetState, INITIAL_DATASET_STATE } from "@/stores/datasetStore";

const TimeDetectTest = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingUrl, setIsGettingUrl] = useState(false);

  const { data: dataset = INITIAL_DATASET_STATE } = useQuery<DatasetState>({
    queryKey: ['dataset'],
    initialData: INITIAL_DATASET_STATE,
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDetectTest;