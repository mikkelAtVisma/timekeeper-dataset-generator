import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeRegistration } from "../types/timeRegistration";

interface TimeRegistrationTableProps {
  registrations: TimeRegistration[];
}

export const TimeRegistrationTable = ({ registrations }: TimeRegistrationTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableRow key={reg.registrationId}>
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