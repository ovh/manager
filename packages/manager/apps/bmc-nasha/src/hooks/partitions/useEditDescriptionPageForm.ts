import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

const DESCRIPTION_MAX = 50;

type UseEditDescriptionPageFormProps = {
  serviceName?: string;
  partitionName?: string;
  initialDescription?: string;
  onSuccess: () => void;
};

export function useEditDescriptionPageForm({
  serviceName,
  partitionName,
  initialDescription,
  onSuccess,
}: UseEditDescriptionPageFormProps) {
  const { t } = useTranslation(['partition']);

  const schema = z.object({
    description: z
      .string()
      .trim()
      .max(DESCRIPTION_MAX, {
        message: t(
          'partition:edit_description.max_length',
          `Maximum ${DESCRIPTION_MAX} characters`,
        ),
      }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { description: initialDescription || '' },
  });

  useEffect(() => {
    if (initialDescription !== undefined) {
      form.reset({ description: initialDescription });
    }
  }, [initialDescription, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!serviceName || !partitionName) return;

    try {
      await httpV6.put(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}`,
        {
          partitionDescription: data.description.trim(),
        },
      );
      onSuccess();
    } catch (err) {
      form.setError('description', {
        message:
          (err as Error).message || t('partition:edit_description.error', 'An error occurred'),
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
