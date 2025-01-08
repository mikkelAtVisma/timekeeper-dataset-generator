import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeRegistration } from "../types/timeRegistration";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  addWeeks,
  isSameMonth,
  getWeeksInMonth,
  addMonths,
} from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface TimeRegistrationCalendarProps {
  registrations: TimeRegistration[];
}

type ViewMode = "week" | "month";

export const TimeRegistrationCalendar = ({ registrations }: TimeRegistrationCalendarProps) => {
  const today = new Date(); // Define today variable

  // Get the Monday of the current week
  const getInitialDate = () => {
    return startOfWeek(today, { weekStartsOn: 1 });
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  // Get unique employee IDs
  const employees = useMemo(() => {
    const employeeIds = new Set(registrations.map(reg => reg.employeeId));
    return Array.from(employeeIds).sort();
  }, [registrations]);

  // Get date range based on view mode
  const dateRanges = useMemo(() => {
    if (viewMode === "week") {
      return [eachDayOfInterval({
        start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
        end: endOfWeek(selectedDate, { weekStartsOn: 1 })
      })];
    } else {
      // For month view, start from the Monday and show 4 weeks
      const monthStart = selectedDate;
      const monthEnd = addMonths(monthStart, 1);
      const firstWeekStart = monthStart;
      const weeksToShow = 4;
      
      return Array.from({ length: weeksToShow }, (_, weekIndex) => {
        const weekStart = addWeeks(firstWeekStart, weekIndex);
        return eachDayOfInterval({
          start: weekStart,
          end: endOfWeek(weekStart, { weekStartsOn: 1 })
        });
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
      // For month view, navigate by 4 weeks
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 28 : -28));
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
              {dateRanges.map((weekDates, weekIndex) => (
                <div key={weekIndex} className="mb-4">
                  {/* Header row with dates for each week */}
                  <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-2 mb-2">
                    <div className="font-semibold">
                      {viewMode === 'month' && `Week ${weekIndex + 1}`}
                    </div>
                    {weekDates.map((date) => (
                      <div 
                        key={date.toISOString()} 
                        className={`font-semibold text-center p-2 text-xs ${
                          !isSameMonth(date, selectedDate) && viewMode === 'month'
                            ? 'text-muted-foreground'
                            : ''
                        } ${
                          format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div>{format(date, 'd')}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {format(date, 'EEE')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grid rows for each employee */}
                  {employees.map((employeeId) => (
                    <div 
                      key={`${weekIndex}-${employeeId}`}
                      className="grid grid-cols-[200px_repeat(7,1fr)] gap-2 mb-2"
                    >
                      <div className="font-medium p-2">{employeeId}</div>
                      {weekDates.map((date) => {
                        const registration = getRegistrationForDate(employeeId, date);
                        return (
                          <div 
                            key={date.toISOString()}
                            className={`p-2 text-center border rounded ${
                              !isSameMonth(date, selectedDate) && viewMode === 'month'
                                ? 'bg-muted/50'
                                : registration 
                                  ? 'bg-accent' 
                                  : 'bg-background'
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
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};