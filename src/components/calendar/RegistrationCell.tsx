import { TimeRegistration } from "@/types/timeRegistration";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RegistrationCellProps {
  registration: TimeRegistration;
  isSelected: boolean;
  onClick: (registration: TimeRegistration) => void;
}

export const RegistrationCell = ({ registration, isSelected, onClick }: RegistrationCellProps) => {
  const getAnomalyDescription = (registration: TimeRegistration) => {
    if (!registration.anomaly) return null;
    const severity = registration.anomaly === 1 ? "Weak" : "Strong";
    return `${severity} anomaly detected in: ${registration.anomalyField}`;
  };

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
        isSelected
          ? 'ring-2 ring-primary'
          : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(registration);
      }}
    >
      <div>{registration.workDuration.toFixed(2)}h</div>
      <div className="text-muted-foreground text-[10px]">
        {registration.workCategory}
      </div>
    </div>
  );

  return anomalyDescription ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {registrationContent}
        </TooltipTrigger>
        <TooltipContent>
          <p>{anomalyDescription}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <div>
      {registrationContent}
    </div>
  );
};