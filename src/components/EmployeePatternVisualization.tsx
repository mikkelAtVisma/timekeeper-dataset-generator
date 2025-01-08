import React from "react";
import { EmployeeWorkPattern } from "../types/timeRegistration";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EmployeePatternVisualizationProps {
  patterns: EmployeeWorkPattern[];
}

export const EmployeePatternVisualization = ({
  patterns,
}: EmployeePatternVisualizationProps) => {
  const formatHour = (hour: number) => {
    return format(new Date().setHours(hour, 0), "ha");
  };

  const formatBreakDuration = (duration: number) => {
    const hours = Math.floor(duration);
    const minutes = (duration % 1) * 60;
    if (hours === 0) {
      return `${minutes}min`;
    }
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}min`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee Work Patterns</CardTitle>
        <CardDescription>
          Overview of allowed work time slots, break durations, and categories for each employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Allowed Start Times</TableHead>
              <TableHead>Allowed End Times</TableHead>
              <TableHead>Break Durations</TableHead>
              <TableHead>Work Categories</TableHead>
              <TableHead>Weekend Work</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patterns.map((pattern) => (
              <TableRow key={pattern.employeeId}>
                <TableCell>{pattern.employeeId}</TableCell>
                <TableCell>{pattern.departmentId}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pattern.allowedStartTimes.map((time) => (
                      <Badge key={time} variant="outline">
                        {formatHour(time)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pattern.allowedEndTimes.map((time) => (
                      <Badge key={time} variant="outline">
                        {formatHour(time)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pattern.allowedBreakDurations.map((duration) => (
                      <Badge key={duration} variant="outline">
                        {formatBreakDuration(duration)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {pattern.allowedWorkCategories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={pattern.canWorkWeekends ? "default" : "destructive"}>
                    {pattern.canWorkWeekends ? "Yes" : "No"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};