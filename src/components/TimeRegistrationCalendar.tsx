import React, { useState, useMemo, useEffect, useRef } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimeRegistrationCalendarProps {
  registrations: TimeRegistration[];
  selectedRegistrationId?: string | null;
  onRegistrationClick?: (registration: TimeRegistration) => void;
}

export const TimeRegistrationCalendar = ({ 
  registrations,
  selectedRegistrationId,
  onRegistrationClick
}: TimeRegistrationCalendarProps) => {
  const today = new Date();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const getAnomalyDescription = (registration: TimeRegistration) => {
    if (!registration.anomaly) return null;
    const severity = registration.anomaly === 1 ? "Weak" : "Strong";
    return `${severity} anomaly detected in: ${registration.anomalyField}`;
  };

  useEffect(() => {
    if (selectedRegistrationId && scrollAreaRef.current) {
      const selectedElement = scrollAreaRef.current.querySelector(`[data-registration-id="${selectedRegistrationId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedRegistrationId]);

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
          <ScrollArea className="h-[600px]" ref={scrollAreaRef}>
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
                              {dayRegistrations.map((registration) => {
                                const anomalyDescription = getAnomalyDescription(registration);
                                const registrationContent = (
                                  <div 
                                    data-registration-id={registration.registrationId}
                                    className={`text-xs p-1 rounded cursor-pointer ${
                                      registration.anomaly 
                                        ? registration.anomaly === 1 
                                          ? 'bg-yellow-200 dark:bg-yellow-900'
                                          : 'bg-red-200 dark:bg-red-900'
                                        : 'bg-accent'
                                    } ${
                                      selectedRegistrationId === registration.registrationId
                                        ? 'ring-2 ring-primary'
                                        : ''
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRegistrationClick?.(registration);
                                    }}
                                  >
                                    <div>{registration.workDuration.toFixed(2)}h</div>
                                    <div className="text-muted-foreground text-[10px]">
                                      {registration.workCategory}
                                    </div>
                                  </div>
                                );

                                return anomalyDescription ? (
                                  <Tooltip key={registration.registrationId}>
                                    <TooltipTrigger asChild>
                                      {registrationContent}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{anomalyDescription}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                ) : (
                                  <div key={registration.registrationId}>
                                    {registrationContent}
                                  </div>
                                );
                              })}
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
