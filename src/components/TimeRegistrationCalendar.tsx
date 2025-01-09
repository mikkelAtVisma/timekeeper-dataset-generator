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
  startOfMonth,
  endOfMonth,
  differenceInWeeks,
} from "date-fns";
import { CalendarHeader } from "./calendar/CalendarHeader";
import { RegistrationCell } from "./calendar/RegistrationCell";
import { getInitialDate } from "@/utils/dateUtils";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(() => 
    getInitialDate(registrations, selectedRegistrationId)
  );

  const employees = useMemo(() => {
    const employeeIds = new Set(registrations.map(reg => reg.employeeId));
    return Array.from(employeeIds).sort();
  }, [registrations]);

  const dateRanges = useMemo(() => {
    // Get the start and end of the current month
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    // Get the start of the week containing the first day of the month
    const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    // Get the end of the week containing the last day of the month
    const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    // Calculate the number of weeks needed to display the full month
    const weeksToShow = differenceInWeeks(lastWeekEnd, firstWeekStart) + 1;

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
    // Navigate by months instead of weeks
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  useEffect(() => {
    // Update selected date when a new registration is selected
    if (selectedRegistrationId) {
      const selectedRegistration = registrations.find(
        reg => reg.registrationId === selectedRegistrationId
      );
      if (selectedRegistration) {
        setSelectedDate(new Date(selectedRegistration.date));
      }
    }
  }, [selectedRegistrationId, registrations]);

  useEffect(() => {
    if (selectedRegistrationId && scrollAreaRef.current) {
      const selectedElement = scrollAreaRef.current.querySelector(
        `[data-registration-id="${selectedRegistrationId}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedRegistrationId]);

  return (
    <div className="space-y-4">
      <CalendarHeader 
        selectedDate={selectedDate}
        onNavigate={navigateDate}
      />

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
                          format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
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
                              {dayRegistrations.map((registration) => (
                                <RegistrationCell
                                  key={registration.registrationId}
                                  registration={registration}
                                  isSelected={selectedRegistrationId === registration.registrationId}
                                  onClick={onRegistrationClick || (() => {})}
                                />
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