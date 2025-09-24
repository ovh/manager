
import { RadioGroup, RadioGroupItem, Label } from "@datatr-ux/uxlib";
import React from "react";

interface EncryptStepProps {
  value?: string;
  onChange?: (newValue: string) => void;
}
const EncryptStep = React.forwardRef<HTMLInputElement, EncryptStepProps>(
  ({ value, onChange }, ref) => {
    return (
        <RadioGroup
          value={value}
          onValueChange={(newValue) => {
            onChange(newValue);
          }}
          data-testid="encrypt-select-container"
          ref={ref}>
            <div className="flex items-center gap-3">
              <RadioGroupItem value={"disabled"} id="encrypt-step-no-encryption" />
              <Label htmlFor="encrypt-step-no-encryption">No encryption</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value={"enabled"} id="encrypt-step-server-side-encryption" />
              <Label htmlFor="encrypt-step-server-side-encryption">Server-side encryption with keys managed by OVHcloud (SSE-OMK)</Label>
            </div>
        </RadioGroup>
    );
  },
);


EncryptStep.displayName = 'EncryptStep';
export default EncryptStep;