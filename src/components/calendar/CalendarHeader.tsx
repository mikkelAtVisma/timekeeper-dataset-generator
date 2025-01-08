import { format } from "date-fns";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  selectedDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export const CalendarHeader = ({ selectedDate, onNavigate }: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigate('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};