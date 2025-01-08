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
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const uniqueValues = useMemo(() => {
    return {
      dates: [...new Set(registrations.map(reg => reg.date))],
      employeeIds: [...new Set(registrations.map(reg => reg.employeeId))],
      projectIds: [...new Set(registrations.map(reg => reg.projectId))],
      departmentIds: [...new Set(registrations.map(reg => reg.departmentId))],
      workCategories: [...new Set(registrations.map(reg => reg.workCategory))],
      workDurations: [...new Set(registrations.map(reg => reg.workDuration.toString()))],
      breakDurations: [...new Set(registrations.map(reg => reg.breakDuration.toString()))],
    };
  }, [registrations]);

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
      (!filters.date || reg.date === filters.date) &&
      (!filters.employeeId || reg.employeeId === filters.employeeId) &&
      (!filters.projectId || reg.projectId === filters.projectId) &&
      (!filters.departmentId || reg.departmentId === filters.departmentId) &&
      (!filters.workCategory || reg.workCategory === filters.workCategory) &&
      (!filters.workDuration || reg.workDuration.toString() === filters.workDuration) &&
      (!filters.breakDuration || reg.breakDuration.toString() === filters.breakDuration) &&
      (!filters.publicHoliday || 
        (filters.publicHoliday === 'yes' && reg.publicHoliday) ||
        (filters.publicHoliday === 'no' && !reg.publicHoliday))
    );
  });

  const renderSelect = (
    field: string,
    options: string[],
    placeholder: string
  ) => (
    <Select
      value={filters[field as keyof typeof filters]}
      onValueChange={(value) => handleFilterChange(field, value)}
    >
      <SelectTrigger className="h-8 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Date</div>
                {renderSelect('date', uniqueValues.dates, 'Filter date...')}
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Employee</div>
                {renderSelect('employeeId', uniqueValues.employeeIds, 'Filter employee...')}
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Project</div>
                {renderSelect('projectId', uniqueValues.projectIds, 'Filter project...')}
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Department</div>
                {renderSelect('departmentId', uniqueValues.departmentIds, 'Filter department...')}
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Category</div>
                {renderSelect('workCategory', uniqueValues.workCategories, 'Filter category...')}
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Duration</div>
                {renderSelect('workDuration', uniqueValues.workDurations, 'Filter duration...')}
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Break</div>
                {renderSelect('breakDuration', uniqueValues.breakDurations, 'Filter break...')}
              </div>
            </TableHead>
            <TableHead>
              <div className="space-y-2">
                <div>Holiday</div>
                <Select
                  value={filters.publicHoliday}
                  onValueChange={(value) => handleFilterChange('publicHoliday', value)}
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="yes/no" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
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