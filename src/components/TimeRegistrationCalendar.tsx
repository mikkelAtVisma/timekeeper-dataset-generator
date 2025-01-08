import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimeRegistration } from "../types/timeRegistration";
import { format } from "date-fns";

interface TimeRegistrationCalendarProps {
  registrations: TimeRegistration[];
}

export const TimeRegistrationCalendar = ({ registrations }: TimeRegistrationCalendarProps) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(today);

  const registrationsForDate = selectedDate 
    ? registrations.filter(reg => reg.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  return (
    <div className="flex gap-4">
      <div className="border rounded-lg p-4 bg-white">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md"
        />
      </div>
      
      <Card className="flex-1">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </h3>
          <ScrollArea className="h-[400px]">
            {registrationsForDate.length > 0 ? (
              <div className="space-y-4">
                {registrationsForDate.map((reg) => (
                  <div 
                    key={reg.registrationId} 
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Employee: {reg.employeeId}</p>
                        <p className="text-sm text-gray-600">Project: {reg.projectId}</p>
                        <p className="text-sm text-gray-600">Category: {reg.workCategory}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Duration: {reg.workDuration}h</p>
                        <p className="text-sm text-gray-600">Break: {reg.breakDuration}h</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No registrations for this date</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};