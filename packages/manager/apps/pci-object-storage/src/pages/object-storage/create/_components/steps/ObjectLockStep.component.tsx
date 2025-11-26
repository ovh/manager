import {
  Alert,
  AlertDescription,
  RadioGroup,
  RadioGroupItem,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
} from '@datatr-ux/uxlib';
import { HelpCircleIcon, Info } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import storages from '@/types/Storages';

interface ObjectLockStepProps {
  value?: storages.ObjectLockStatusEnum;
  onChange?: (newValue: storages.ObjectLockStatusEnum) => void;
  versioning?: storages.VersioningStatusEnum;
  acknowledgement?: boolean;
  onAcknowledgementChange?: (checked: boolean) => void;
  acknowledgementError?: string;
}

const ObjectLockStep = React.forwardRef<HTMLInputElement, ObjectLockStepProps>(
  (
    {
      value,
      onChange,
      versioning,
      acknowledgement,
      onAcknowledgementChange,
      acknowledgementError,
    },
    ref,
  ) => {
    const { t } = useTranslation('pci-object-storage/order-funnel');
    const isVersioningDisabled =
      versioning === storages.VersioningStatusEnum.disabled;
    const isObjectLockEnabled = value === storages.ObjectLockStatusEnum.enabled;

    return (
      <div className="flex flex-col gap-4">
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
            />
            <Label
              htmlFor="object-lock-enabled-option"
              className="flex gap-2 justify-center"
            >
              {t(
                `versionningTypeLabel-${storages.ObjectLockStatusEnum.enabled}`,
              )}
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
        </RadioGroup>

        {/* Alert shown when Object Lock is enabled */}
        {isObjectLockEnabled && (
          <>
            <Alert variant="information" className="rounded-md">
              <AlertDescription className="flex gap-2 items-center">
                <Info className="size-4" />
                {t('objectLockCannotDisableAlert')}
              </AlertDescription>
            </Alert>

            {/* Acknowledgement checkbox */}
            <div
              className={`flex items-start gap-3 p-3 border rounded-md ${
                acknowledgementError ? 'border-destructive' : 'border-border'
              }`}
            >
              <Checkbox
                id="object-lock-acknowledgement"
                checked={acknowledgement}
                onCheckedChange={onAcknowledgementChange}
                data-testid="object-lock-acknowledgement-checkbox"
              />
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="object-lock-acknowledgement"
                  className="font-normal cursor-pointer"
                >
                  {t('objectLockAcknowledgementLabel')}
                </Label>
                {acknowledgementError && (
                  <p className="text-sm text-destructive">
                    {acknowledgementError}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  },
);

ObjectLockStep.displayName = 'ObjectLockStep';
export default ObjectLockStep;
