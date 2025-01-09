import { Button } from "@/components/ui/button";
import { TimeRegistration } from "@/types/timeRegistration";
import { Copy } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CopyRegistrationsButtonProps {
  registrations: TimeRegistration[];
}

export const CopyRegistrationsButton = ({ registrations }: CopyRegistrationsButtonProps) => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatRegistrationsForCopy = (filteredRegistrations: TimeRegistration[]) => {
    return filteredRegistrations
      .map((reg) => {
        const formattedDuration = `${reg.workDuration}h`;
        const formattedBreak = `${reg.breakDuration}h`;
        return [
          "0",
          reg.date,
          reg.employeeId,
          reg.projectId,
          reg.departmentId,
          reg.workCategory,
          format(new Date(reg.startTime), "HH:mm"),
          format(new Date(reg.endTime), "HH:mm"),
          formattedDuration,
          formattedBreak,
          reg.publicHoliday ? "Yes" : "No"
        ].join("\t");
      })
      .join("\n");
  };

  const handleCopy = () => {
    let filteredRegistrations = [...registrations];
    
    if (startDate && endDate) {
      filteredRegistrations = registrations.filter(
        (reg) => reg.date >= startDate && reg.date <= endDate
      );
    }

    const formattedData = formatRegistrationsForCopy(filteredRegistrations);
    
    navigator.clipboard.writeText(formattedData).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: `${filteredRegistrations.length} registrations copied successfully`,
        });
      },
      (err) => {
        toast({
          title: "Error copying to clipboard",
          description: "Please try again",
          variant: "destructive",
        });
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Copy className="h-4 w-4" />
          Copy Registrations
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy Registrations</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleCopy} className="w-full">
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};