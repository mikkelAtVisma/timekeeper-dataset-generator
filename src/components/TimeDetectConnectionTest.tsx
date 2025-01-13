import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { timeDetectService } from "@/services/timeDetectService";

export const TimeDetectConnectionTest = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
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
  );
};