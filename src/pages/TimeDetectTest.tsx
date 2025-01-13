import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { DatasetSection } from "@/components/DatasetSection";
import { TimeDetectConnectionTest } from "@/components/TimeDetectConnectionTest";
import { TimeDetectUrlSection } from "@/components/TimeDetectUrlSection";

const TimeDetectTest = () => {
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
          <DatasetSection />
          
          <div className="space-y-4">
            <TimeDetectConnectionTest />

            <div className="border-t pt-4">
              <TimeDetectUrlSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeDetectTest;