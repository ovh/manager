import {
  RadioGroup,
  RadioGroupItem,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';
import { HelpCircle } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import storages from '@/types/Storages';

interface EncryptStepProps {
  value?: storages.EncryptionAlgorithmEnum;
  onChange?: (newValue: storages.EncryptionAlgorithmEnum) => void;
}
const EncryptStep = React.forwardRef<HTMLInputElement, EncryptStepProps>(
  ({ value, onChange }, ref) => {
    const { t } = useTranslation('pci-object-storage/order-funnel');
    const ENCRYPTION_TYPES: storages.EncryptionAlgorithmEnum[] = [
      storages.EncryptionAlgorithmEnum.plaintext,
      storages.EncryptionAlgorithmEnum.AES256,
    ];
    return (
      <RadioGroup
        value={value}
        onValueChange={onChange}
        data-testid="encrypt-select-container"
        ref={ref}
      >
        {ENCRYPTION_TYPES.map((encryptionAlgorithm) => (
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value={encryptionAlgorithm}
              id={`encrypt-step-${encryptionAlgorithm}`}
            />
            <Label htmlFor={`encrypt-step-${encryptionAlgorithm}`}>
              {t(`encryptionTypeLabel-${encryptionAlgorithm}`)}
            </Label>
            {t(`encryptionTypeDescription-${encryptionAlgorithm}`, '') && (
              <Popover>
                <PopoverTrigger asChild>
                  <HelpCircle className="size-4" />
                </PopoverTrigger>
                <PopoverContent className="text-xs">
                  {t(`encryptionTypeDescription-${encryptionAlgorithm}`)}
                </PopoverContent>
              </Popover>
            )}
          </div>
        ))}
      </RadioGroup>
    );
  },
);

EncryptStep.displayName = 'EncryptStep';
export default EncryptStep;
