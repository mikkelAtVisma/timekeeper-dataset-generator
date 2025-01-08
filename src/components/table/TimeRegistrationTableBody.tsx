import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { CircleAlert } from "lucide-react";
import { TimeRegistration } from "../../types/timeRegistration";

interface TimeRegistrationTableBodyProps {
  registrations: TimeRegistration[];
  selectedRegistrationId?: string | null;
  onRegistrationClick?: (registration: TimeRegistration) => void;
}

export const TimeRegistrationTableBody = ({ 
  registrations,
  selectedRegistrationId,
  onRegistrationClick
}: TimeRegistrationTableBodyProps) => {
  const isAnomalous = (reg: TimeRegistration) => {
    return reg.anomaly && reg.anomaly > 0;
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <TableBody>
      {registrations.map((reg) => (
        <TableRow 
          key={`${reg.registrationId}-${reg.date}-${reg.employeeId}`}
          data-registration-id={reg.registrationId}
          className={`cursor-pointer hover:bg-accent/50 ${
            isAnomalous(reg) ? "bg-red-50" : ""
          } ${
            selectedRegistrationId === reg.registrationId ? "bg-accent" : ""
          }`}
          onClick={() => onRegistrationClick?.(reg)}
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
          <TableCell>{formatTime(reg.startTime)}</TableCell>
          <TableCell>{formatTime(reg.endTime)}</TableCell>
          <TableCell>{reg.workDuration}h</TableCell>
          <TableCell>{reg.breakDuration}h</TableCell>
          <TableCell>{reg.publicHoliday ? "Yes" : "No"}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};