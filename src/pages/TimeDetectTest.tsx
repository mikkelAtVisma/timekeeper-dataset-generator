import { useState } from "react";
import { Button } from "@/components/ui/button";
import { timeDetectService } from "@/services/timeDetectService";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TimeDetectTest = () => {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">TimeDetect Connection Test</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          <p className="text-gray-600">
            Test the connection to the TimeDetect service by clicking the button below.
          </p>
          <Button 
            onClick={handleTestConnection} 
            disabled={isLoading}
          >
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeDetectTest;