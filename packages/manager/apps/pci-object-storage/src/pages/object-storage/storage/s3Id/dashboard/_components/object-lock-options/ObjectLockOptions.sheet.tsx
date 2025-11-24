import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  RadioGroupItem,
  Label,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  useToast,
  RadioGroup,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Alert,
  AlertDescription,
} from '@datatr-ux/uxlib';
import { StorageLockConfigurationRule } from '@datatr-ux/ovhcloud-types/cloud/index';
import { AlertCircle } from 'lucide-react';
import RouteSheet from '@/components/route-sheet/RouteSheet.component';
import storages from '@/types/Storages';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import { useUpdateS3 } from '@/data/hooks/s3-storage/useUpdateS3.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import {
  fromISO8601,
  toISO8601,
  DurationUnit,
} from '@/lib/iso8601DurationHelper';

export interface Label {
  key?: string;
  value?: string;
}

const ObjectLockOptions = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const navigate = useNavigate();
  const toast = useToast();
  const { projectId, region, s3Name } = useParams();

  // Retrieve container data
  const s3Query = useGetS3({ projectId, region, name: s3Name });

  // Update S3 storage hook
  const { updateS3Storage, isPending } = useUpdateS3({
    onError: (err) => {
      toast.toast({
        title: t('toastErrorTitle'),
        variant: 'critical',
        description: getObjectStoreApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('toastSuccessTitle'),
        description: t('editObjectLockToastSuccessDescription'),
      });
      navigate('../');
    },
  });

  // Duration limits by unit
  const durationLimits = {
    D: 36500,
    Y: 100,
  };

  // Get max value for current unit
  const getMaxDurationValue = (unit: string) => {
    return durationLimits[unit as keyof typeof durationLimits] || 100;
  };

  // Local state for object lock data
  const [objectLockData, setObjectLockData] = useState<{
    status: storages.ObjectLockStatusEnum;
    rule?: StorageLockConfigurationRule;
  }>({
    status: s3Query.data?.objectLock?.status,
    rule: s3Query.data?.objectLock?.rule,
  });

  // Local state for duration input
  const [duration, setDuration] = useState(() =>
    fromISO8601(s3Query.data?.objectLock?.rule?.period),
  );

  // Handle retention option change
  const handleRetentionChange = (value: string) => {
    if (value === 'true') {
      setObjectLockData({
        status:
          s3Query.data?.objectLock.status ||
          storages.ObjectLockStatusEnum.enabled,
        rule: {
          mode: storages.ObjectLockModeEnum.governance,
          period: toISO8601(duration.value, duration.unit),
        },
      });
    } else {
      setObjectLockData({
        status:
          s3Query.data?.objectLock.status ||
          storages.ObjectLockStatusEnum.enabled,
      });
    }
  };

  // Handle retention mode change
  const handleRetentionModeChange = (value: string) => {
    setObjectLockData({
      ...objectLockData,
      rule: {
        ...objectLockData.rule,
        mode: value as storages.ObjectLockModeEnum,
        period: toISO8601(duration.value, duration.unit),
      },
    });
  };

  // Handle duration value change
  const handleDurationValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value, 10);
    const maxValue = getMaxDurationValue(duration.unit);

    if (!Number.isNaN(value) && value > 0 && value <= maxValue) {
      setDuration({ ...duration, value });
      if (objectLockData.rule) {
        setObjectLockData({
          ...objectLockData,
          rule: {
            ...objectLockData.rule,
            period: toISO8601(value, duration.unit),
          },
        });
      }
    }
  };

  // Handle duration unit change
  const handleDurationUnitChange = (unit: string) => {
    const typedUnit = unit as DurationUnit;
    const maxValue = getMaxDurationValue(typedUnit);
    let newValue = duration.value;

    // If current value exceeds max for new unit, cap it
    if (duration.value > maxValue) newValue = maxValue;

    setDuration({ value: newValue, unit: typedUnit });
    if (objectLockData.rule) {
      setObjectLockData({
        ...objectLockData,
        rule: {
          ...objectLockData.rule,
          period: toISO8601(newValue, typedUnit),
        },
      });
    }
  };

  // Retention options (enabled/disabled)
  const retentionOptions = [
    {
      id: 'disabled',
      value: 'false',
    },
    {
      id: 'enabled',
      value: 'true',
    },
  ];

  // Retention mode options
  const retentionModeOptions = [
    { id: 'governance', value: storages.ObjectLockModeEnum.governance },
    { id: 'compliance', value: storages.ObjectLockModeEnum.compliance },
  ];

  // Duration unit options
  const durationUnitOptions = [
    { id: 'D', label: 'objectLockDurationUnitDays' },
    { id: 'Y', label: 'objectLockDurationUnitYears' },
  ];

  // Submit updated container configuration
  const onSubmit = () => {
    const data = {
      projectId,
      region,
      name: s3Name,
      data: {
        objectLock: objectLockData,
      },
    };

    updateS3Storage(data);
  };

  return (
    <RouteSheet>
      <SheetContent className="flex flex-col gap-2">
        <SheetHeader>
          <SheetTitle data-testid="edit-object-lock-sheet">
            {t('editObjectLockTitle')}
          </SheetTitle>
          <SheetDescription>{t('editObjectLockDescription')}</SheetDescription>
        </SheetHeader>

        <div className="gap-6 flex flex-col">
          {/* Retention */}
          <RadioGroup
            value={objectLockData.rule ? 'true' : 'false'}
            onValueChange={handleRetentionChange}
          >
            <span
              className="text-sm font-medium"
              id="offsite-replication-radio"
            >
              {t('objectLockRetentionGroupLabel')}
            </span>

            {retentionOptions.map((option) => (
              <div className="flex-1" key={option.value}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`object-lock-retention-${option.id}-option`}
                  />
                  <Label htmlFor={`object-lock-retention-${option.id}-option`}>
                    {t(`objectLockRetentionLabel${option.id}`)}
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>

          {/* Retention Mode */}
          <RadioGroup
            value={objectLockData.rule?.mode}
            onValueChange={handleRetentionModeChange}
            disabled={!objectLockData.rule}
          >
            <span className="text-sm font-medium" id="retention-mode-radio">
              {t('objectLockRetentionModeGroupLabel')}
            </span>

            {retentionModeOptions.map((option) => (
              <div key={option.value} className="flex-1">
                <div className="flex items-start gap-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`object-lock-mode-${option.id}-option`}
                    className="mt-1"
                  />
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`object-lock-mode-${option.id}-option`}>
                      {t(`objectLockRetentionModeLabel_${option.id}`)}
                    </Label>
                    <Label className="text-sm text-muted-foreground">
                      {t(`objectLockRetentionModeDescription_${option.id}`)}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          {/* Compliance Mode Warning */}
          {objectLockData.rule?.mode ===
            storages.ObjectLockModeEnum.compliance && (
            <Alert variant="warning" className="rounded-md">
              <AlertDescription className="flex gap-2 items-center">
                <AlertCircle className="size-4" />
                {t('objectLockComplianceModeWarning')}
              </AlertDescription>
            </Alert>
          )}

          {/* Duration Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="duration-input" className="text-sm font-medium">
              {t('objectLockDurationLabel')}
            </Label>
            <div className="flex gap-2">
              <Input
                id="duration-input"
                type="number"
                min="1"
                max={getMaxDurationValue(duration.unit)}
                value={duration.value}
                onChange={handleDurationValueChange}
                className="w-24 text-center"
                disabled={!objectLockData.rule}
              />
              <Select
                value={duration.unit}
                onValueChange={handleDurationUnitChange}
                disabled={!objectLockData.rule}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durationUnitOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {t(option.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t p-4 ">
          <SheetClose asChild>
            <Button
              data-testid="edit-object-lock-cancel-button"
              type="button"
              mode="ghost"
            >
              {t('objectLockOptionsButtonCancel')}
            </Button>
          </SheetClose>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isPending}
            form="object-lock-form"
          >
            {t('objectLockOptionsButtonConfirm')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </RouteSheet>
  );
};

ObjectLockOptions.displayName = 'ObjectLockOptions';

export default ObjectLockOptions;
