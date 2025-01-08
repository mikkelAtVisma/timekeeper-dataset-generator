import { TableHead } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimeRegistration } from "../../types/timeRegistration";

interface SortableTableHeaderProps {
  children: React.ReactNode;
  field: keyof TimeRegistration;
  currentSort: { 
    field: keyof TimeRegistration | ''; 
    direction: 'asc' | 'desc' | null 
  };
  onSort: (field: keyof TimeRegistration) => void;
  className?: string;
}

export const SortableTableHeader = ({
  children,
  field,
  currentSort,
  onSort,
  className,
}: SortableTableHeaderProps) => {
  return (
    <TableHead className={className}>
      <div className="space-y-2">
        <Button
          variant="ghost"
          onClick={() => onSort(field)}
          className="h-8 flex items-center gap-1 hover:bg-transparent"
        >
          <div>{children}</div>
          <ArrowUpDown className={`ml-2 h-4 w-4 ${
            currentSort.field === field 
              ? currentSort.direction ? 'text-foreground' : 'text-muted-foreground'
              : 'text-muted-foreground'
          }`} />
        </Button>
      </div>
    </TableHead>
  );
};