import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TimeRegistration } from "../types/timeRegistration";
import { useState, useMemo, useEffect, useRef } from "react";
import { TableFilters } from "./table/TableFilters";
import { SortableTableHeader } from "./table/SortableTableHeader";
import { TimeRegistrationTableBody } from "./table/TimeRegistrationTableBody";
import { sortRegistrations } from "../utils/sortUtils";

interface TimeRegistrationTableProps {
  registrations: TimeRegistration[];
  selectedRegistrationId?: string | null;
  onRegistrationClick?: (registration: TimeRegistration) => void;
}

export const TimeRegistrationTable = ({ 
  registrations,
  selectedRegistrationId,
  onRegistrationClick
}: TimeRegistrationTableProps) => {
  const [filters, setFilters] = useState({
    date: "all",
    employeeId: "all",
    projectId: "all",
    departmentId: "all",
    workCategory: "all",
    workDuration: "all",
    breakDuration: "all",
    publicHoliday: "all",
  });

  const [sort, setSort] = useState<{
    field: keyof TimeRegistration | '';
    direction: 'asc' | 'desc' | null;
  }>({
    field: '',
    direction: null,
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

  const handleSort = (field: keyof TimeRegistration) => {
    setSort(prev => ({
      field,
      direction: 
        prev.field === field
          ? prev.direction === 'asc'
            ? 'desc'
            : prev.direction === 'desc'
              ? null
              : 'asc'
          : 'asc'
    }));
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredAndSortedRegistrations = useMemo(() => {
    let result = registrations.filter((reg) => {
      return (
        (filters.date === "all" || reg.date === filters.date) &&
        (filters.employeeId === "all" || reg.employeeId === filters.employeeId) &&
        (filters.projectId === "all" || reg.projectId === filters.projectId) &&
        (filters.departmentId === "all" || reg.departmentId === filters.departmentId) &&
        (filters.workCategory === "all" || reg.workCategory === filters.workCategory) &&
        (filters.workDuration === "all" || reg.workDuration.toString() === filters.workDuration) &&
        (filters.breakDuration === "all" || reg.breakDuration.toString() === filters.breakDuration) &&
        (filters.publicHoliday === "all" || 
          (filters.publicHoliday === "yes" && reg.publicHoliday) ||
          (filters.publicHoliday === "no" && !reg.publicHoliday))
      );
    });

    return sortRegistrations(result, sort.field, sort.direction);
  }, [registrations, filters, sort]);

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRegistrationId && tableRef.current) {
      const selectedRow = tableRef.current.querySelector(`[data-registration-id="${selectedRegistrationId}"]`);
      if (selectedRow) {
        selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedRegistrationId]);

  return (
    <div className="rounded-md border" ref={tableRef}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Status</TableHead>
            <SortableTableHeader field="date" currentSort={sort} onSort={handleSort} className="w-[100px]">
              <div>Date</div>
              <TableFilters
                field="date"
                options={uniqueValues.dates}
                placeholder="Filter date..."
                value={filters.date}
                onValueChange={(value) => handleFilterChange('date', value)}
              />
            </SortableTableHeader>
            <SortableTableHeader field="employeeId" currentSort={sort} onSort={handleSort} className="w-[120px]">
              <div>Employee</div>
              <TableFilters
                field="employeeId"
                options={uniqueValues.employeeIds}
                placeholder="Filter employee..."
                value={filters.employeeId}
                onValueChange={(value) => handleFilterChange('employeeId', value)}
              />
            </SortableTableHeader>
            <SortableTableHeader field="projectId" currentSort={sort} onSort={handleSort} className="w-[80px]">
              <div>Project</div>
              <TableFilters
                field="projectId"
                options={uniqueValues.projectIds}
                placeholder="Filter project..."
                value={filters.projectId}
                onValueChange={(value) => handleFilterChange('projectId', value)}
              />
            </SortableTableHeader>
            <SortableTableHeader field="departmentId" currentSort={sort} onSort={handleSort} className="w-[100px]">
              <div>Department</div>
              <TableFilters
                field="departmentId"
                options={uniqueValues.departmentIds}
                placeholder="Filter department..."
                value={filters.departmentId}
                onValueChange={(value) => handleFilterChange('departmentId', value)}
              />
            </SortableTableHeader>
            <SortableTableHeader field="workCategory" currentSort={sort} onSort={handleSort} className="w-[120px]">
              <div>Category</div>
              <TableFilters
                field="workCategory"
                options={uniqueValues.workCategories}
                placeholder="Filter category..."
                value={filters.workCategory}
                onValueChange={(value) => handleFilterChange('workCategory', value)}
              />
            </SortableTableHeader>
            <SortableTableHeader field="startTime" currentSort={sort} onSort={handleSort} className="w-[80px]">
              <div>Start Time</div>
            </SortableTableHeader>
            <SortableTableHeader field="endTime" currentSort={sort} onSort={handleSort} className="w-[80px]">
              <div>End Time</div>
            </SortableTableHeader>
            <SortableTableHeader field="workDuration" currentSort={sort} onSort={handleSort} className="w-[90px]">
              <div>Duration</div>
              <TableFilters
                field="workDuration"
                options={uniqueValues.workDurations}
                placeholder="Filter duration..."
                value={filters.workDuration}
                onValueChange={(value) => handleFilterChange('workDuration', value)}
              />
            </SortableTableHeader>
            <SortableTableHeader field="breakDuration" currentSort={sort} onSort={handleSort} className="w-[80px]">
              <div>Break</div>
              <TableFilters
                field="breakDuration"
                options={uniqueValues.breakDurations}
                placeholder="Filter break..."
                value={filters.breakDuration}
                onValueChange={(value) => handleFilterChange('breakDuration', value)}
              />
            </SortableTableHeader>
            <SortableTableHeader field="publicHoliday" currentSort={sort} onSort={handleSort} className="w-[80px]">
              <div>Holiday</div>
              <TableFilters
                field="publicHoliday"
                options={["yes", "no"]}
                placeholder="Filter holiday..."
                value={filters.publicHoliday}
                onValueChange={(value) => handleFilterChange('publicHoliday', value)}
              />
            </SortableTableHeader>
          </TableRow>
        </TableHeader>
        <TimeRegistrationTableBody 
          registrations={filteredAndSortedRegistrations}
          selectedRegistrationId={selectedRegistrationId}
          onRegistrationClick={onRegistrationClick}
        />
      </Table>
    </div>
  );
};
