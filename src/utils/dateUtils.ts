import { startOfWeek, addMonths, startOfMonth } from "date-fns";

export const getInitialDate = (registrations: { date: string }[], selectedRegistrationId: string | null) => {
  if (selectedRegistrationId && registrations.length > 0) {
    const selectedRegistration = registrations.find(reg => reg.registrationId === selectedRegistrationId);
    if (selectedRegistration) {
      // Start from the month of the selected registration
      return startOfMonth(new Date(selectedRegistration.date));
    }
  }
  
  // Default to current month if no registration is selected
  return startOfWeek(new Date(), { weekStartsOn: 1 });
};