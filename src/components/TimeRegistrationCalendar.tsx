import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeRegistration } from "../types/timeRegistration";
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  addWeeks,
  addMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface TimeRegistrationCalendarProps {
  registrations: TimeRegistration[];
}

export const TimeRegistrationCalendar = ({ registrations }: TimeRegistrationCalendarProps) => {
  const today = new Date();

  const getInitialDate = () => {
    return startOfWeek(today, { weekStartsOn: 1 });
  };

  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());

  const employees = useMemo(() => {
    const employeeIds = new Set(registrations.map(reg => reg.employeeId));
    return Array.from(employeeIds).sort();
  }, [registrations]);

  const dateRanges = useMemo(() => {
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
  }, [selectedDate]);

  const getRegistrationsForDate = (employeeId: string, date: Date) => {
    return registrations.filter(reg => 
      reg.employeeId === employeeId && 
      reg.date === format(date, 'yyyy-MM-dd')
    );
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 28 : -28));
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
            {format(selectedDate, 'MMMM yyyy')}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateDate('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <ScrollArea className="h-[600px]">
            <div className="min-w-[800px]">
              {dateRanges.map((weekDates, weekIndex) => (
                <div key={weekIndex} className="mb-4">
                  <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-2 mb-2">
                    <div className="font-semibold">
                      Week {weekIndex + 1}
                    </div>
                    {weekDates.map((date) => (
                      <div 
                        key={date.toISOString()} 
                        className={`font-semibold text-center p-2 text-xs ${
                          !isSameMonth(date, selectedDate)
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

                  {employees.map((employeeId) => (
                    <div 
                      key={`${weekIndex}-${employeeId}`}
                      className="grid grid-cols-[200px_repeat(7,1fr)] gap-2 mb-2"
                    >
                      <div className="font-medium p-2">{employeeId}</div>
                      {weekDates.map((date) => {
                        const dayRegistrations = getRegistrationsForDate(employeeId, date);
                        return (
                          <div 
                            key={date.toISOString()}
                            className={`p-2 text-center border rounded min-h-[80px] ${
                              !isSameMonth(date, selectedDate)
                                ? 'bg-muted/50'
                                : dayRegistrations.length > 0
                                  ? 'bg-accent/20' 
                                  : 'bg-background'
                            }`}
                          >
                            <div className="flex flex-col gap-1">
                              {dayRegistrations.map((registration, idx) => (
                                <div 
                                  key={registration.registrationId} 
                                  className={`text-xs p-1 rounded bg-accent ${
                                    idx > 0 ? 'mt-1' : ''
                                  }`}
                                >
                                  <div>{registration.workDuration.toFixed(2)}h</div>
                                  <div className="text-muted-foreground text-[10px]">
                                    {registration.workCategory}
                                  </div>
                                </div>
                              ))}
                            </div>
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