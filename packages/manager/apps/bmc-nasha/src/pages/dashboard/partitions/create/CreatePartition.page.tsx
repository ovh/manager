import { useMemo } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import {
  BaseLayout,
  Button,
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  Input,
  Message,
  Radio,
  RadioGroup,
} from '@ovh-ux/muk';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { SIZE_MIN } from '@/constants/Nasha.constants';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { usePartitionAllocatedSize } from '@/hooks/dashboard/usePartitionAllocatedSize';
import {
  DESCRIPTION_MAX,
  NAME_PATTERN,
  useCreatePartitionForm,
} from '@/hooks/partitions/useCreatePartitionForm';
import { usePartitions } from '@/hooks/partitions/usePartitions';

type ProtocolOption = {
  value: string;
  label: string;
  description: string;
};

const PROTOCOL_OPTIONS: ProtocolOption[] = [
  {
    value: 'NFS',
    label: 'NFS',
    description: 'Network File System protocol',
  },
  {
    value: 'CIFS',
    label: 'CIFS',
    description: 'Common Internet File System protocol',
  },
];

export default function CreatePartitionPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { t } = useTranslation(['common', 'partitions']);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const { data: nasha, isLoading: isNashaLoading } = useNashaDetail(serviceName ?? '');
  const { data: partitionAllocatedSize } = usePartitionAllocatedSize(serviceName ?? '');
  const { data: partitions } = usePartitions(serviceName ?? '');

  // Calculate boundaries
  const boundaries = useMemo(() => {
    if (!nasha || partitionAllocatedSize === undefined) {
      return { min: SIZE_MIN, max: SIZE_MIN };
    }

    const availableSize = nasha.zpoolSize - partitionAllocatedSize;
    const maxSize = Math.floor(availableSize / (1024 * 1024 * 1024)); // Convert bytes to GB

    return { min: SIZE_MIN, max: maxSize };
  }, [nasha, partitionAllocatedSize]);

  // Get existing partition names for validation
  const existingPartitionNames = useMemo(
    () => (partitions || []).map((p) => p.partitionName),
    [partitions],
  );

  const { form, handleSubmit, isSubmitting } = useCreatePartitionForm({
    serviceName,
    boundaries,
    existingPartitionNames,
    onSuccess: (taskId) => {
      void navigate('../task-tracker', {
        state: {
          taskId,
          operation: 'create',
          params: { partitionName: form.getValues('partitionName') },
          taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
        },
      });
    },
  });

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partitions', 'create', 'cancel'],
    });
    // Navigate back to partitions list using relative path
    void navigate('..', { replace: true });
  };

  const onSubmit = async () => {
    const protocol = form.getValues('protocol');
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partitions', 'create', `confirm_${protocol}`],
    });

    try {
      await handleSubmit();
    } catch {
      // Error handled by form
    }
  };

  if (isNashaLoading || !nasha) {
    return <div>Loading...</div>;
  }

  const canCreatePartitions = partitionAllocatedSize !== undefined && boundaries.max >= SIZE_MIN;

  if (!canCreatePartitions) {
    return (
      <BaseLayout
        header={{
          title: t('partitions:create.title'),
        }}
      >
        <Message color="critical" title={t('partitions:create.errors.max_reached')}>
          {t('partitions:create.errors.max_reached_description')}
        </Message>
        <div className="mt-4">
          <Button variant="ghost" onClick={handleCancel}>
            {t('partitions:create.cancel')}
          </Button>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      header={{
        title: t('partitions:create.title'),
      }}
    >
      <div className="mb-4 text-sm text-gray-600">{serviceName}</div>
      <form onSubmit={void handleSubmit} className="max-w-2xl">
        <FormField>
          <FormFieldLabel>{t('partitions:create.name')}</FormFieldLabel>
          <Input
            type="text"
            {...form.register('partitionName')}
            disabled={isSubmitting}
            required
            pattern={NAME_PATTERN.source}
          />
          <FormFieldHelper>{t('partitions:create.name_rules')}</FormFieldHelper>
          {form.formState.errors.partitionName && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.partitionName.message}
            </FormFieldHelper>
          )}
        </FormField>

        <FormField className="mt-4">
          <FormFieldLabel>{t('partitions:create.size')}</FormFieldLabel>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              {...form.register('size', { valueAsNumber: true })}
              min={boundaries.min}
              max={boundaries.max}
              step={1}
              disabled={isSubmitting}
              className="w-32"
              required
            />
            <span className="text-gray-600">GB</span>
          </div>
          <FormFieldHelper>
            {t('partitions:create.size_rules', {
              min: boundaries.min,
              max: boundaries.max,
            })}
          </FormFieldHelper>
          {form.formState.errors.size && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.size.message}
            </FormFieldHelper>
          )}
        </FormField>

        <FormField className="mt-4">
          <FormFieldLabel>{t('partitions:create.description')}</FormFieldLabel>
          <Input
            type="text"
            {...form.register('description')}
            maxLength={DESCRIPTION_MAX}
            disabled={isSubmitting}
          />
          <FormFieldHelper>
            {t('partitions:create.description_rules', { max: DESCRIPTION_MAX })}
          </FormFieldHelper>
          {form.formState.errors.description && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.description.message}
            </FormFieldHelper>
          )}
        </FormField>

        <FormField className="mt-4">
          <FormFieldLabel>{t('partitions:create.protocol')}</FormFieldLabel>
          <RadioGroup
            {...form.register('protocol')}
            value={form.watch('protocol')}
            onValueChange={(detail: { value?: string | null } | string) => {
              const value = typeof detail === 'string' ? detail : detail.value || '';
              form.setValue('protocol', value, { shouldValidate: true });
            }}
            disabled={isSubmitting}
          >
            {PROTOCOL_OPTIONS.map((opt) => (
              <div key={opt.value} className="mb-2">
                <Radio value={opt.value}>{opt.label}</Radio>
                <p className="text-sm text-gray-600 ml-6">{opt.description}</p>
              </div>
            ))}
          </RadioGroup>
          {form.formState.errors.protocol && (
            <FormFieldHelper className="text-red-600">
              {form.formState.errors.protocol.message}
            </FormFieldHelper>
          )}
        </FormField>

        {form.formState.errors.root && (
          <Message color="critical" className="mt-4">
            {form.formState.errors.root.message}
          </Message>
        )}

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !form.formState.isValid}
            loading={isSubmitting}
            onClick={void onSubmit}
          >
            {t('partitions:create.submit')}
          </Button>
          <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSubmitting}>
            {t('partitions:create.cancel')}
          </Button>
        </div>
      </form>
    </BaseLayout>
  );
}
