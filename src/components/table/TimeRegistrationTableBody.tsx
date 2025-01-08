import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CircleAlert } from "lucide-react";
import { TimeRegistration } from "../../types/timeRegistration";

interface TimeRegistrationTableBodyProps {
  registrations: TimeRegistration[];
}

export const TimeRegistrationTableBody = ({ registrations }: TimeRegistrationTableBodyProps) => {
  const isAnomalous = (reg: TimeRegistration) => {
    return reg.anomaly && reg.anomaly > 0;
  };

  return (
    <TableBody>
      {registrations.map((reg) => (
        <TableRow 
          key={`${reg.registrationId}-${reg.date}-${reg.employeeId}`}
          className={isAnomalous(reg) ? "bg-red-50" : ""}
        >
          <TableCell>
            {isAnomalous(reg) && (
              <div className="flex items-center gap-2">
                <CircleAlert className="h-4 w-4 text-[#ea384c]" />
                <span className="text-xs text-red-600">
                  Anomaly in: {reg.anomalyField}
                </span>
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
        </TableRow>
      ))}
    </TableBody>
  );
};