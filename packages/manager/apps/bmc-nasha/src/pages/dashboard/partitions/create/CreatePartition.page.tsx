import { useState, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { BaseLayout, FormField, Input, Button, Message, RadioGroup, Radio } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';
import { SIZE_MIN } from '@/constants/nasha.constants';
import { useNashaDetail } from '@/hooks/dashboard/useNashaDetail';
import { usePartitionAllocatedSize } from '@/hooks/dashboard/usePartitionAllocatedSize';
import { usePartitions } from '@/hooks/partitions/usePartitions';
import { APP_NAME } from '@/Tracking.constants';

const NAME_PATTERN = /^[a-z0-9_-]+$/i;
const DESCRIPTION_MAX = 50;

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

  const [partitionName, setPartitionName] = useState('');
  const [size, setSize] = useState(SIZE_MIN);
  const [description, setDescription] = useState('');
  const [protocol, setProtocol] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Validate form
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!partitionName) {
      newErrors.partitionName = t('partitions:create.errors.name_required');
    } else if (!NAME_PATTERN.test(partitionName)) {
      newErrors.partitionName = t('partitions:create.errors.name_invalid');
    } else if (existingPartitionNames.includes(partitionName)) {
      newErrors.partitionName = t('partitions:create.errors.name_exists');
    }

    if (!size || size < boundaries.min || size > boundaries.max) {
      newErrors.size = t('partitions:create.errors.size_invalid', {
        min: boundaries.min,
        max: boundaries.max,
      });
    }

    if (description.length > DESCRIPTION_MAX) {
      newErrors.description = t('partitions:create.errors.description_max', {
        max: DESCRIPTION_MAX,
      });
    }

    if (!protocol) {
      newErrors.protocol = t('partitions:create.errors.protocol_required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partitions', 'create', 'cancel'],
    });
    // Navigate back to partitions list using relative path
    navigate('..', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !serviceName || !nasha) {
      return;
    }

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, 'partitions', 'create', `confirm_${protocol}`],
    });

    setIsSubmitting(true);
    setErrors({});

    try {
      const sizeInBytes = size * 1024 * 1024 * 1024; // Convert GB to bytes

      const response = await httpV6.post<{ taskId: number }>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition`,
        {
          partitionName: partitionName.trim(),
          size: sizeInBytes,
          partitionDescription: description.trim() || undefined,
          protocol,
        },
      );

      // Navigate to task tracker using relative path
      navigate('../task-tracker', {
        state: {
          taskId: response.data.taskId,
          operation: 'create',
          params: { partitionName },
          taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
        },
      });
    } catch (err) {
      setErrors({
        submit: (err as Error).message || t('partitions:create.errors.submit_failed'),
      });
      setIsSubmitting(false);
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
          description: serviceName,
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
        description: serviceName,
      }}
    >
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <FormField error={errors.partitionName}>
          <FormField.Label required>
            {t('partitions:create.name')}
          </FormField.Label>
          <Input
            type="text"
            value={partitionName}
            onChange={(e) => setPartitionName(e.target.value)}
            disabled={isSubmitting}
            required
            pattern={NAME_PATTERN.source}
          />
          <FormField.Helper>
            {t('partitions:create.name_rules')}
          </FormField.Helper>
        </FormField>

        <FormField error={errors.size} className="mt-4">
          <FormField.Label required>
            {t('partitions:create.size')}
          </FormField.Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={size}
              min={boundaries.min}
              max={boundaries.max}
              step={1}
              onChange={(e) => setSize(Number(e.target.value))}
              disabled={isSubmitting}
              className="w-32"
              required
            />
            <span className="text-gray-600">GB</span>
          </div>
          <FormField.Helper>
            {t('partitions:create.size_rules', {
              min: boundaries.min,
              max: boundaries.max,
            })}
          </FormField.Helper>
        </FormField>

        <FormField error={errors.description} className="mt-4">
          <FormField.Label>
            {t('partitions:create.description')}
          </FormField.Label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={DESCRIPTION_MAX}
            disabled={isSubmitting}
          />
          <FormField.Helper>
            {t('partitions:create.description_rules', { max: DESCRIPTION_MAX })}
          </FormField.Helper>
        </FormField>

        <FormField error={errors.protocol} className="mt-4">
          <FormField.Label required>
            {t('partitions:create.protocol')}
          </FormField.Label>
          <RadioGroup
            value={protocol}
            onValueChange={setProtocol}
            disabled={isSubmitting}
          >
            {PROTOCOL_OPTIONS.map((opt) => (
              <div key={opt.value} className="mb-2">
                <Radio value={opt.value} name="protocol">
                  {opt.label}
                </Radio>
                <p className="text-sm text-gray-600 ml-6">{opt.description}</p>
              </div>
            ))}
          </RadioGroup>
        </FormField>

        {errors.submit && (
          <Message color="critical" className="mt-4">
            {errors.submit}
          </Message>
        )}

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            variant="default"
            disabled={isSubmitting || !partitionName || !protocol || size < boundaries.min || size > boundaries.max}
            isLoading={isSubmitting}
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

