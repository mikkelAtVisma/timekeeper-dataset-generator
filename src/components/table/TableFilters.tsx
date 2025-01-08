import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableFiltersProps {
  field: string;
  options: string[];
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
}

export const TableFilters = ({
  field,
  options,
  placeholder,
  value,
  onValueChange,
}: TableFiltersProps) => {
  // Sort options based on field type
  const sortedOptions = [...options].sort((a, b) => {
    // For dates
    if (field === 'date') {
      return new Date(a).getTime() - new Date(b).getTime();
    }
    // For numeric values (workDuration, breakDuration)
    if (field === 'workDuration' || field === 'breakDuration') {
      return parseFloat(a) - parseFloat(b);
    }
    // For all other fields (alphabetical sorting)
    return a.localeCompare(b);
  });

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="h-8 w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {sortedOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};