import {
  Alert,
  AlertDescription,
  RadioGroup,
  RadioGroupItem,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';
import { HelpCircleIcon, Info } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import storages from '@/types/Storages';
import { cn } from '@/lib/utils';

interface ObjectLockStepProps {
  value?: storages.ObjectLockStatusEnum;
  onChange?: (newValue: storages.ObjectLockStatusEnum) => void;
  versioning?: storages.VersioningStatusEnum;
}

const ObjectLockStep = React.forwardRef<HTMLInputElement, ObjectLockStepProps>(
  ({ value, onChange, versioning }, ref) => {
    const { t } = useTranslation('pci-object-storage/order-funnel');
    const isVersioningDisabled =
      versioning === storages.VersioningStatusEnum.disabled;
    const isObjectLockEnabled = value === storages.ObjectLockStatusEnum.enabled;

    return (
      <RadioGroup
        value={value}
        onValueChange={(newValue) => {
          onChange(newValue as storages.ObjectLockStatusEnum);
        }}
        data-testid="object-lock-select-container"
        ref={ref}
      >
        {/* Disabled option */}
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value={storages.ObjectLockStatusEnum.disabled}
            id="object-lock-disabled-option"
          />
          <Label
            htmlFor="object-lock-disabled-option"
            className="flex gap-2 justify-center"
          >
            {t(
              `versionningTypeLabel-${storages.ObjectLockStatusEnum.disabled}`,
            )}
          </Label>
        </div>

        {/* Enabled option with versioning constraint */}
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value={storages.ObjectLockStatusEnum.enabled}
            id="object-lock-enabled-option"
            disabled={isVersioningDisabled}
          />
          <Label htmlFor="object-lock-enabled-option">
            <span
              className={cn(
                isVersioningDisabled && 'opacity-70 cursor-not-allowed',
              )}
            >
              {t(
                `versionningTypeLabel-${storages.ObjectLockStatusEnum.enabled}`,
              )}
            </span>
          </Label>
          {/* Help popover shown when versioning is disabled */}
          {isVersioningDisabled && (
            <Popover>
              <PopoverTrigger asChild>
                <HelpCircleIcon className="size-4" />
              </PopoverTrigger>
              <PopoverContent className="text-sm">
                {t('objectLockTypeDisabledPopover')}
              </PopoverContent>
            </Popover>
          )}
        </div>
        {/* Alert shown when Object Lock is enabled */}
        {isObjectLockEnabled && (
          <Alert variant="information">
            <AlertDescription className="flex gap-2 items-center">
              <Info className="size-4" />
              {t('objectLockCannotDisableAlert')}
            </AlertDescription>
          </Alert>
        )}
      </RadioGroup>
    );
  },
);

ObjectLockStep.displayName = 'ObjectLockStep';
export default ObjectLockStep;
