import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { type UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

const NAME_PATTERN = /^[a-z0-9_-]+$/i;
const DESCRIPTION_MAX = 50;

type Boundaries = {
  min: number;
  max: number;
};

type UseCreatePartitionFormProps = {
  serviceName?: string;
  boundaries: Boundaries;
  existingPartitionNames: string[];
  onSuccess: (taskId: number) => void;
};

export type PartitionFormValues = {
  partitionName: string;
  size: number;
  description?: string;
  protocol: string;
};

/**
 * Creates validation schema for partition creation form
 */
function createPartitionValidationSchema(
  boundaries: Boundaries,
  existingPartitionNames: string[],
  t: ReturnType<typeof useTranslation>['t'],
) {
  return z.object({
    partitionName: z
      .string()
      .min(1, {
        message: t('partitions:create.errors.name_required', 'Name is required'),
      })
      .regex(NAME_PATTERN, {
        message: t(
          'partitions:create.errors.name_invalid',
          'Name must contain only alphanumeric characters, underscores, and hyphens',
        ),
      })
      .refine((name) => !existingPartitionNames.includes(name), {
        message: t('partitions:create.errors.name_exists', 'This name already exists'),
      }),
    size: z
      .number()
      .int(t('partitions:create.errors.size_integer', 'Size must be an integer'))
      .min(boundaries.min, {
        message: t('partitions:create.errors.size_invalid', {
          min: boundaries.min,
          max: boundaries.max,
        }),
      })
      .max(boundaries.max, {
        message: t('partitions:create.errors.size_invalid', {
          min: boundaries.min,
          max: boundaries.max,
        }),
      }),
    description: z
      .string()
      .max(DESCRIPTION_MAX, {
        message: t('partitions:create.errors.description_max', {
          max: DESCRIPTION_MAX,
        }),
      })
      .optional(),
    protocol: z.string().min(1, {
      message: t('partitions:create.errors.protocol_required', 'Protocol is required'),
    }),
  });
}

/**
 * Creates submit handler for partition creation
 */
function createPartitionSubmitHandler(
  serviceName: string | undefined,
  form: UseFormReturn<PartitionFormValues>,
  onSuccess: (taskId: number) => void,
  t: ReturnType<typeof useTranslation>['t'],
) {
  return form.handleSubmit(async (data) => {
    if (!serviceName) return;

    const sizeInBytes = data.size * 1024 * 1024 * 1024; // Convert GB to bytes

    try {
      const response = await httpV6.post<{ taskId: number }>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition`,
        {
          partitionName: data.partitionName.trim(),
          size: sizeInBytes,
          partitionDescription: data.description?.trim() || undefined,
          protocol: data.protocol,
        },
      );

      onSuccess(response.data.taskId);
    } catch (err) {
      form.setError('root', {
        message:
          (err as Error).message ||
          t('partitions:create.errors.submit_failed', 'An error occurred'),
      });
      throw err;
    }
  });
}

export function useCreatePartitionForm({
  serviceName,
  boundaries,
  existingPartitionNames,
  onSuccess,
}: UseCreatePartitionFormProps) {
  const { t } = useTranslation(['partitions']);

  const schema = useMemo(
    () => createPartitionValidationSchema(boundaries, existingPartitionNames, t),
    [boundaries, existingPartitionNames, t],
  );

  const form = useForm<PartitionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      partitionName: '',
      size: boundaries.min,
      description: '',
      protocol: '',
    },
    mode: 'onChange',
  });

  const handleSubmit = createPartitionSubmitHandler(serviceName, form, onSuccess, t);

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}

export { NAME_PATTERN, DESCRIPTION_MAX };
