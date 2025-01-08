import React, { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeRegistration } from "../types/timeRegistration";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TimeRegistrationCalendarProps {
  registrations: TimeRegistration[];
}

type ViewMode = "week" | "month";

export const TimeRegistrationCalendar = ({ registrations }: TimeRegistrationCalendarProps) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  // Get unique employee IDs
  const employees = useMemo(() => {
    const employeeIds = new Set(registrations.map(reg => reg.employeeId));
    return Array.from(employeeIds).sort();
  }, [registrations]);

  // Get date range based on view mode
  const dateRange = useMemo(() => {
    if (viewMode === "week") {
      return eachDayOfInterval({
        start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
        end: endOfWeek(selectedDate, { weekStartsOn: 1 })
      });
    } else {
      return eachDayOfInterval({
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate)
      });
    }
  }, [selectedDate, viewMode]);

  // Get registrations for a specific employee and date
  const getRegistrationForDate = (employeeId: string, date: Date) => {
    return registrations.find(reg => 
      reg.employeeId === employeeId && 
      reg.date === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </div>
        <RadioGroup
          value={viewMode}
          onValueChange={(value: ViewMode) => setViewMode(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="week" id="week" />
            <Label htmlFor="week">Week View</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="month" id="month" />
            <Label htmlFor="month">Month View</Label>
          </div>
        </RadioGroup>
      </div>

      <Card>
        <CardContent className="p-4">
          <ScrollArea className="h-[600px]">
            <div className="min-w-[800px]">
              {/* Header row with dates */}
              <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(120px,1fr))] gap-2 mb-4">
                <div className="font-semibold">Employee</div>
                {dateRange.map((date) => (
                  <div 
                    key={date.toISOString()} 
                    className="font-semibold text-center p-2 bg-muted"
                  >
                    {format(date, 'MMM d')}
                  </div>
                ))}
              </div>

              {/* Grid rows for each employee */}
              {employees.map((employeeId) => (
                <div 
                  key={employeeId}
                  className="grid grid-cols-[200px_repeat(auto-fill,minmax(120px,1fr))] gap-2 mb-2"
                >
                  <div className="font-medium p-2">{employeeId}</div>
                  {dateRange.map((date) => {
                    const registration = getRegistrationForDate(employeeId, date);
                    return (
                      <div 
                        key={date.toISOString()}
                        className={`p-2 text-center border rounded ${
                          registration ? 'bg-accent' : 'bg-background'
                        }`}
                      >
                        {registration && (
                          <div className="text-xs">
                            <div>{registration.workDuration.toFixed(2)}h</div>
                            <div className="text-muted-foreground">
                              {registration.workCategory}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};