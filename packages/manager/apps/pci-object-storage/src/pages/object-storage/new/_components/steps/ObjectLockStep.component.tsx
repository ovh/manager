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
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import storages from '@/types/Storages';
import A from '@/components/links/A.component';
import { STORAGE_OBJECT_LOCK_LINKS, useLink } from '../orderFunnel.constants';

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
    const objectLockDocLink = useLink(STORAGE_OBJECT_LOCK_LINKS);
    const isVersioningDisabled =
      versioning === storages.VersioningStatusEnum.disabled;
    const isObjectLockEnabled = value === storages.ObjectLockStatusEnum.enabled;

    // Scroll to Object Lock section when error appears
    useEffect(() => {
      if (acknowledgementError) {
        const section = document.getElementById('object-lock');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, [acknowledgementError]);

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
              data-testid="object-lock-disabled-option"
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
              data-testid="object-lock-enabled-option"
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
            <Popover>
              <PopoverTrigger asChild>
                <HelpCircleIcon className="size-4" />
              </PopoverTrigger>
              <PopoverContent className="text-sm">
                {t('objectLockTypeDisabledPopover')}
              </PopoverContent>
            </Popover>
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
                className={acknowledgementError ? 'border-destructive' : ''}
              />
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="object-lock-acknowledgement"
                  className="font-normal cursor-pointer"
                >
                  <Trans
                    i18nKey="objectLockAcknowledgementLabel"
                    ns="pci-object-storage/order-funnel"
                    components={[
                      <A href={objectLockDocLink} target="_blank" />,
                    ]}
                  />
                </Label>
                {acknowledgementError && (
                  <p
                    className="text-sm text-destructive"
                    role="alert"
                    aria-live="polite"
                  >
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
