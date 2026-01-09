import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
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
import { FormField } from '@/components/form-field/FormField.component';
// import { StorageLockConfigurationRule } from '@datatr-ux/ovhcloud-types/cloud/index';
import RouteSheet from '@/components/route-sheet/RouteSheet.component';
import storages from '@/types/Storages';
import { useGetS3 } from '@/data/hooks/s3-storage/useGetS3.hook';
import { useUpdateS3 } from '@/data/hooks/s3-storage/useUpdateS3.hook';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import { useObjectLockOptionsForm } from './ObjectLockOptions.hook';
import { getMaxDurationValue } from './ObjectLockOptions.schema';
import { toISO8601 } from '@/lib/iso8601DurationHelper';
import A from '@/components/links/A.component';
import {
  STORAGE_OBJECT_LOCK_LINKS,
  useLink,
} from '@/pages/object-storage/create/_components/orderFunnel.const';

export interface Label {
  key?: string;
  value?: string;
}

const ObjectLockOptions = () => {
  const { t } = useTranslation('pci-object-storage/storages/s3/dashboard');
  const objectLockDocLink = useLink(STORAGE_OBJECT_LOCK_LINKS);
  const navigate = useNavigate();
  const toast = useToast();
  const { projectId, region, s3Name } = useParams();

  // Retrieve container data
  const s3Query = useGetS3({ projectId, region, name: s3Name });

  const { form } = useObjectLockOptionsForm({
    currentObjectLockOptions: s3Query.data?.objectLock,
  });

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

  // Handle form submission
  const onSubmit = form.handleSubmit((values) => {
    const data = {
      projectId,
      region,
      name: s3Name,
      data: {
        objectLock: {
          status: s3Query.data?.objectLock?.status,
          rule: values?.retention
            ? {
                mode: values.rule?.mode,
                period: toISO8601(
                  values.rule?.durationValue,
                  values.rule?.durationUnit,
                ),
              }
            : undefined,
        },
      },
    };
    updateS3Storage(data);
  });

  return (
    <RouteSheet>
      <SheetContent className="flex flex-col gap-2">
        <SheetHeader>
          <SheetTitle data-testid="edit-object-lock-sheet">
            {t('editObjectLockTitle')}
          </SheetTitle>
          <SheetDescription>
            <Trans
              i18nKey="editObjectLockDescription"
              ns="pci-object-storage/storages/s3/dashboard"
              components={[<A href={objectLockDocLink} target="_blank" />]}
            />
          </SheetDescription>
        </SheetHeader>
        <form id="object-lock-options-form" onSubmit={onSubmit}>
          <div className="gap-6 flex flex-col">
            {/* Retention */}
            <FormField name="retention" form={form}>
              {(field) => (
                <RadioGroup
                  value={field.value ? 'true' : 'false'}
                  onValueChange={(value) => field.onChange(value === 'true')} // Convert to boolean
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
                          data-testid={`object-lock-retention-${option.id}-option`}
                          value={option.value}
                          id={`object-lock-retention-${option.id}-option`}
                        />
                        <Label
                          htmlFor={`object-lock-retention-${option.id}-option`}
                        >
                          {t(`objectLockRetentionLabel${option.id}`)}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </FormField>

            {/* Retention Mode */}
            <FormField name="rule.mode" form={form}>
              {(field) => (
                <RadioGroup
                  data-testid="retention-mode-radio-group"
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!form.getValues('retention')}
                >
                  <span
                    className="text-sm font-medium"
                    id="retention-mode-radio"
                  >
                    {t('objectLockRetentionModeGroupLabel')}
                  </span>

                  {retentionModeOptions.map((option) => (
                    <div key={option.value} className="flex-1">
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          data-testid={`object-lock-mode-${option.id}-option`}
                          value={option.value}
                          id={`object-lock-mode-${option.id}-option`}
                          className="mt-1"
                        />
                        <div className="flex flex-col gap-1">
                          <Label
                            htmlFor={`object-lock-mode-${option.id}-option`}
                          >
                            {t(`objectLockRetentionModeLabel_${option.id}`)}
                          </Label>
                          <Label className="text-sm text-muted-foreground">
                            {t(
                              `objectLockRetentionModeDescription_${option.id}`,
                            )}
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </FormField>

            {/* Compliance Mode Warning */}
            {form.getValues('rule.mode') ===
              storages.ObjectLockModeEnum.compliance && (
              <Alert variant="warning" className="rounded-md">
                <AlertDescription className="flex gap-2 items-center">
                  <AlertCircle className="size-4" />
                  <div>
                    <Trans
                      i18nKey="objectLockComplianceModeWarning"
                      ns="pci-object-storage/storages/s3/dashboard"
                      components={[
                        <br />,
                        <A href={objectLockDocLink} target="_blank" />,
                      ]}
                    ></Trans>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Duration Input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="duration-input" className="text-sm font-medium">
                {t('objectLockDurationLabel')}
              </Label>
              <div className="flex gap-2">
                <div className="w-24">
                  <FormField name="rule.durationValue" form={form}>
                    {(field) => (
                      <Input
                        id="duration-input"
                        type="number"
                        min="1"
                        max={getMaxDurationValue(
                          form.getValues('rule.durationUnit') || 'D',
                        )}
                        value={field.value}
                        onChange={(value) => {
                          // convert input to number
                          const intValue = parseInt(value.target.value, 10);
                          field.onChange(Number.isNaN(intValue) ? 1 : intValue);
                        }}
                        className="w-full text-center"
                        disabled={!form.getValues('retention')}
                      />
                    )}
                  </FormField>
                </div>
                <div className="flex-1">
                  <FormField name="rule.durationUnit" form={form}>
                    {(field) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!form.getValues('retention')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durationUnitOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {t(option.label, {
                                count:
                                  form.getValues('rule.durationValue') || 1,
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>
                </div>
              </div>
            </div>
          </div>
        </form>
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
            data-testid="edit-object-lock-confirm-button"
            type="submit"
            disabled={isPending}
            form="object-lock-options-form"
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
