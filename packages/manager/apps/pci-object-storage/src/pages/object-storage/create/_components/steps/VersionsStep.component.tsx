
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem, Label, Popover, PopoverTrigger, PopoverContent } from "@datatr-ux/uxlib";
import { HelpCircleIcon } from "lucide-react";
import React from "react";

interface VersionsStepProps {
  value?: string;
  onChange?: (newValue: string) => void;
  isOffsiteReplicationActivated?: boolean;
}
const VersionsStep = React.forwardRef<HTMLInputElement, VersionsStepProps>(
  ({ value, onChange, isOffsiteReplicationActivated = false }, ref) => {
    return (
        <RadioGroup
          value={value}
          onValueChange={(newValue) => {
            onChange(newValue);
          }}
          data-testid="versioning-select-container"
          ref={ref}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value={"disabled"} id="versioning-disabled-option" disabled={isOffsiteReplicationActivated}/>
              <Label htmlFor="versioning-disabled-option" className="flex gap-2 justify-center">
                <span className={cn(isOffsiteReplicationActivated && 'opacity-70 cursor-not-allowed')}>Désactiver</span>
                {isOffsiteReplicationActivated && (
                  <Popover>
                    <PopoverTrigger>
                      <HelpCircleIcon className="size-4"/>
                    </PopoverTrigger>
                    <PopoverContent>Le versioning ne peut pas être désactivé car vous avez activé la réplication. Modifiez l'étape Offsite Replication si vous souhaitez le désactiver.</PopoverContent>
                  </Popover>
                  
                )}
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value={"enabled"} id="versioning-enabled-option" />
              <Label htmlFor="versioning-enabled-option">Activer</Label>
            </div>
        </RadioGroup>
    );
  },
);


VersionsStep.displayName = 'VersionsStep';
export default VersionsStep;