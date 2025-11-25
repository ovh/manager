import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

type Boundaries = {
  min: number;
  max: number;
};

type UseEditSizeFormProps = {
  serviceName?: string;
  partitionName?: string;
  initialSize: number; // in GB
  boundaries: Boundaries;
  onSuccess: () => void;
};

export function useEditSizeForm({
  serviceName,
  partitionName,
  initialSize,
  boundaries,
  onSuccess,
}: UseEditSizeFormProps) {
  const { t } = useTranslation(['partition']);

  const boundariesError = t('partition:edit_size.boundaries_error', {
    min: boundaries.min,
    max: boundaries.max,
  });

  const schema = useMemo(
    () =>
      z.object({
        size: z
          .number()
          .int(t('partition:edit_size.integer', 'Size must be an integer'))
          .min(boundaries.min, { message: boundariesError })
          .max(boundaries.max, { message: boundariesError }),
      }),
    [boundaries, t, boundariesError],
  );

  const form = useForm<{ size: number }>({
    resolver: zodResolver(schema),
    defaultValues: { size: initialSize },
    mode: 'onChange',
  });

  useEffect(() => {
    form.reset({ size: initialSize });
  }, [initialSize, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!serviceName || !partitionName) return;

    try {
      await httpV6.put(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}`,
        {
          size: data.size * 1024 * 1024 * 1024,
        },
      );
      onSuccess();
    } catch (err) {
      form.setError('size', {
        message: (err as Error).message || t('partition:edit_size.error', 'An error occurred'),
      });
      throw err;
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
  };
}
