import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleAlert } from "lucide-react";
import { TimeRegistration } from "../types/timeRegistration";

interface TimeRegistrationTableProps {
  registrations: TimeRegistration[];
}

export const TimeRegistrationTable = ({ registrations }: TimeRegistrationTableProps) => {
  const isAnomalous = (reg: TimeRegistration) => {
    return reg.anomaly && reg.anomaly > 0;
  };

  const getAnomalousField = (reg: TimeRegistration) => {
    // This is a simplified example - in a real application, you would want to
    // determine which specific field is anomalous based on your anomaly detection logic
    if (reg.workDuration > 12) return "Work Duration";
    if (reg.breakDuration > 3) return "Break Duration";
    if (reg.startTime < 6 || reg.startTime > 18) return "Start Time";
    if (reg.endTime < reg.startTime || reg.endTime > 22) return "End Time";
    return "Unknown";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Break</TableHead>
            <TableHead>Holiday</TableHead>
            <TableHead>Numericals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((reg) => (
            <TableRow 
              key={reg.registrationId}
              className={isAnomalous(reg) ? "bg-red-50" : ""}
            >
              <TableCell>
                {isAnomalous(reg) && (
                  <div className="flex items-center gap-2">
                    <CircleAlert className="h-4 w-4 text-[#ea384c]" />
                    <span className="text-xs text-red-600">{getAnomalousField(reg)}</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{reg.date}</TableCell>
              <TableCell>{reg.employeeId}</TableCell>
              <TableCell>{reg.projectId}</TableCell>
              <TableCell>{reg.departmentId}</TableCell>
              <TableCell>{reg.workCategory}</TableCell>
              <TableCell>{reg.workDuration}h</TableCell>
              <TableCell>{reg.breakDuration}h</TableCell>
              <TableCell>{reg.publicHoliday ? "Yes" : "No"}</TableCell>
              <TableCell>
                {reg.numericals.map((n, i) => (
                  <div key={i}>
                    {n.name}: {n.value}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};