import React from "react";
import { TableHead } from "@/components/ui/table";
import { TimeRegistration } from "../../types/timeRegistration";

interface SortableTableHeaderProps {
  field: keyof TimeRegistration;
  currentSort: {
    field: keyof TimeRegistration | "";
    direction: "asc" | "desc" | null;
  };
  onSort: (field: keyof TimeRegistration) => void;
  children: React.ReactNode;
  className?: string;
}

export function SortableTableHeader({
  field,
  currentSort,
  onSort,
  children,
  className,
  ...props
}: SortableTableHeaderProps) {
  const handleClick = React.useCallback(
    () => onSort(field),
    [onSort, field]
  );

  return (
    <TableHead
      className={className}
      onClick={handleClick}
      {...props}
      style={{ cursor: "pointer" }}
    >
      {children}
    </TableHead>
  );
}