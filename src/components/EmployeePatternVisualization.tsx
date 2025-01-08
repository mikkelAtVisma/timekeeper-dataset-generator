import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { EmployeeWorkPattern } from "../types/timeRegistration";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmployeePatternVisualizationProps {
  patterns: EmployeeWorkPattern[];
}

export const EmployeePatternVisualization = ({
  patterns,
}: EmployeePatternVisualizationProps) => {
  const data = patterns.flatMap((pattern) =>
    pattern.allowedStartTimes.flatMap((startTime) =>
      pattern.allowedEndTimes.map((endTime) => ({
        employeeId: pattern.employeeId,
        startTime,
        endTime,
        departmentId: pattern.departmentId,
        canWorkWeekends: pattern.canWorkWeekends,
        workCategories: pattern.allowedWorkCategories,
      }))
    )
  );

  const formatHour = (hour: number) => {
    return format(new Date().setHours(hour, 0), "ha");
  };

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <p className="text-sm font-medium">Employee ID: {data.employeeId}</p>
          <p className="text-sm">
            Time Slot: {formatHour(data.startTime)} - {formatHour(data.endTime)}
          </p>
          <p className="text-sm">Department: {data.departmentId}</p>
          <p className="text-sm">
            Weekend Work: {data.canWorkWeekends ? "Yes" : "No"}
          </p>
          <div className="mt-1">
            <p className="text-sm font-medium">Work Categories:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {data.workCategories.map((category: string) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee Work Patterns</CardTitle>
        <CardDescription>
          Visualization of allowed work time slots for each employee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 60,
              }}
            >
              <XAxis
                type="number"
                dataKey="startTime"
                name="Start Time"
                tickFormatter={formatHour}
                domain={[6, 10]}
              />
              <YAxis
                type="number"
                dataKey="endTime"
                name="End Time"
                tickFormatter={formatHour}
                domain={[15, 19]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Work Pattern" data={data}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.canWorkWeekends ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                    opacity={0.7}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};