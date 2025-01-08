import { TimeRegistration } from "../types/timeRegistration";

export const sortRegistrations = (
  registrations: TimeRegistration[],
  field: keyof TimeRegistration | '',
  direction: 'asc' | 'desc' | null
): TimeRegistration[] => {
  if (!field || !direction) return registrations;

  return [...registrations].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (field === 'date') {
      return direction === 'asc' 
        ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
        : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
    }
    
    const aStr = String(aValue);
    const bStr = String(bValue);
    return direction === 'asc' 
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
};