import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeRegistration } from "../types/timeRegistration";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

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

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            {format(selectedDate, viewMode === 'week' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
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
              <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(80px,1fr))] gap-2 mb-4">
                <div className="font-semibold">Employee</div>
                {dateRange.map((date) => (
                  <div 
                    key={date.toISOString()} 
                    className="font-semibold text-center p-2 bg-muted text-xs"
                  >
                    {format(date, viewMode === 'week' ? 'MMM d' : 'd')}
                  </div>
                ))}
              </div>

              {/* Grid rows for each employee */}
              {employees.map((employeeId) => (
                <div 
                  key={employeeId}
                  className="grid grid-cols-[200px_repeat(auto-fill,minmax(80px,1fr))] gap-2 mb-2"
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