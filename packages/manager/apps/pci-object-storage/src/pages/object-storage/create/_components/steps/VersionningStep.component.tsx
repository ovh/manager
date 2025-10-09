import {
  RadioGroup,
  RadioGroupItem,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@datatr-ux/uxlib';
import { HelpCircleIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import storages from '@/types/Storages';
import { cn } from '@/lib/utils';

interface VersionningStepProps {
  value?: storages.VersioningStatusEnum;
  onChange?: (newValue: storages.VersioningStatusEnum) => void;
  isOffsiteReplicationActivated?: boolean;
}
const VersionningStep = React.forwardRef<
  HTMLInputElement,
  VersionningStepProps
>(({ value, onChange, isOffsiteReplicationActivated = false }, ref) => {
  const { t } = useTranslation('pci-object-storage/order-funnel');
  return (
    <RadioGroup
      value={value}
      onValueChange={(newValue) => {
        onChange(newValue as storages.VersioningStatusEnum);
      }}
      data-testid="versioning-select-container"
      ref={ref}
    >
      <div className="flex items-center gap-3">
        <RadioGroupItem
          value={storages.VersioningStatusEnum.disabled}
          id="versioning-disabled-option"
          disabled={isOffsiteReplicationActivated}
        />
        <Label
          htmlFor="versioning-disabled-option"
          className="flex gap-2 justify-center"
        >
          <span
            className={cn(
              isOffsiteReplicationActivated && 'opacity-70 cursor-not-allowed',
            )}
          >
            {t(
              `versionningTypeLabel-${storages.VersioningStatusEnum.disabled}`,
            )}
          </span>
          {isOffsiteReplicationActivated && (
            <Popover>
              <PopoverTrigger asChild>
                <HelpCircleIcon className="size-4" />
              </PopoverTrigger>
              <PopoverContent className="text-xs">
                {t('versionningTypeDisabledPopover')}
              </PopoverContent>
            </Popover>
          )}
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem
          value={storages.VersioningStatusEnum.enabled}
          id="versioning-enabled-option"
        />
        <Label htmlFor="versioning-enabled-option">
          {t(`versionningTypeLabel-${storages.VersioningStatusEnum.enabled}`)}
        </Label>
      </div>
    </RadioGroup>
  );
});

VersionningStep.displayName = 'VersionningStep';
export default VersionningStep;
