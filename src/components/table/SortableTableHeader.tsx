import { TableHead } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableTableHeaderProps {
  children: React.ReactNode;
  field: string;
  currentSort: { field: string; direction: 'asc' | 'desc' | null };
  onSort: (field: string) => void;
}

export const SortableTableHeader = ({
  children,
  field,
  currentSort,
  onSort,
}: SortableTableHeaderProps) => {
  return (
    <TableHead>
      <div className="space-y-2">
        <Button
          variant="ghost"
          onClick={() => onSort(field)}
          className="h-8 flex items-center gap-1 hover:bg-transparent"
        >
          <div>{children}</div>
          <ArrowUpDown className={`ml-2 h-4 w-4 ${
            currentSort.field === field 
              ? 'text-foreground' 
              : 'text-muted-foreground'
          }`} />
        </Button>
      </div>
    </TableHead>
  );
};