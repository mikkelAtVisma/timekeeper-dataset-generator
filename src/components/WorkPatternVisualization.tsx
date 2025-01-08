import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Cell,
} from "recharts";
import { TimeRegistration } from "../types/timeRegistration";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WorkPatternVisualizationProps {
  registrations: TimeRegistration[];
}

export const WorkPatternVisualization = ({
  registrations,
}: WorkPatternVisualizationProps) => {
  const data = useMemo(() => {
    const patterns = registrations.map((reg) => ({
      employeeId: reg.employeeId,
      startHour: reg.startTime,
      endHour: reg.endTime,
      day: new Date(reg.date).getDay(),
      value: 1,
    }));

    return patterns;
  }, [registrations]);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const formatHour = (hour: number) => {
    return format(new Date().setHours(hour, 0), "ha");
  };

  const formatDay = (day: number) => days[day];

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
          <p className="text-sm">
            {formatDay(data.day)}: {formatHour(data.startHour)} -{" "}
            {formatHour(data.endHour)}
          </p>
          <p className="text-sm text-muted-foreground">
            Employee ID: {data.employeeId}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Work Patterns</CardTitle>
        <CardDescription>
          Visualization of employee work patterns across the week
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
                dataKey="day"
                name="Day"
                tickFormatter={formatDay}
                domain={[0, 6]}
                ticks={[0, 1, 2, 3, 4, 5, 6]}
              />
              <YAxis
                type="number"
                dataKey="startHour"
                name="Hour"
                tickFormatter={formatHour}
                domain={[0, 24]}
              />
              <ZAxis type="number" range={[50, 400]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter name="Work Pattern" data={data}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill="hsl(var(--primary))"
                    opacity={0.5}
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