import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { CircleAlert } from "lucide-react";
import { TimeRegistration } from "../types/timeRegistration";
import { useState } from "react";

interface TimeRegistrationTableProps {
  registrations: TimeRegistration[];
}

export const TimeRegistrationTable = ({ registrations }: TimeRegistrationTableProps) => {
  const [filters, setFilters] = useState({
    date: "",
    employeeId: "",
    projectId: "",
    departmentId: "",
    workCategory: "",
    workDuration: "",
    breakDuration: "",
    publicHoliday: "",
  });

  const isAnomalous = (reg: TimeRegistration) => {
    return reg.anomaly && reg.anomaly > 0;
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredRegistrations = registrations.filter((reg) => {
    return (
      (!filters.date || reg.date.toLowerCase().includes(filters.date.toLowerCase())) &&
      (!filters.employeeId || reg.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())) &&
      (!filters.projectId || reg.projectId.toLowerCase().includes(filters.projectId.toLowerCase())) &&
      (!filters.departmentId || reg.departmentId.toLowerCase().includes(filters.departmentId.toLowerCase())) &&
      (!filters.workCategory || reg.workCategory.toLowerCase().includes(filters.workCategory.toLowerCase())) &&
      (!filters.workDuration || reg.workDuration.toString().includes(filters.workDuration)) &&
      (!filters.breakDuration || reg.breakDuration.toString().includes(filters.breakDuration)) &&
      (!filters.publicHoliday || 
        (filters.publicHoliday.toLowerCase() === 'yes' && reg.publicHoliday) ||
        (filters.publicHoliday.toLowerCase() === 'no' && !reg.publicHoliday))
    );
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Date</div>
                <Input
                  placeholder="Filter date..."
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="h-8"
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Employee</div>
                <Input
                  placeholder="Filter employee..."
                  value={filters.employeeId}
                  onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                  className="h-8"
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Project</div>
                <Input
                  placeholder="Filter project..."
                  value={filters.projectId}
                  onChange={(e) => handleFilterChange('projectId', e.target.value)}
                  className="h-8"
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Department</div>
                <Input
                  placeholder="Filter department..."
                  value={filters.departmentId}
                  onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                  className="h-8"
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Category</div>
                <Input
                  placeholder="Filter category..."
                  value={filters.workCategory}
                  onChange={(e) => handleFilterChange('workCategory', e.target.value)}
                  className="h-8"
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Duration</div>
                <Input
                  placeholder="Filter duration..."
                  value={filters.workDuration}
                  onChange={(e) => handleFilterChange('workDuration', e.target.value)}
                  className="h-8"
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Break</div>
                <Input
                  placeholder="Filter break..."
                  value={filters.breakDuration}
                  onChange={(e) => handleFilterChange('breakDuration', e.target.value)}
                  className="h-8"
                />
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Holiday</div>
                <Input
                  placeholder="yes/no"
                  value={filters.publicHoliday}
                  onChange={(e) => handleFilterChange('publicHoliday', e.target.value)}
                  className="h-8"
                />
              </div>
            </TableHead>
            <TableHead>Numericals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRegistrations.map((reg) => (
            <TableRow 
              key={reg.registrationId}
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