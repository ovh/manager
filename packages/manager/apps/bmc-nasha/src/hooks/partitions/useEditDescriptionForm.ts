import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

const DESCRIPTION_MAX = 50;

type UseEditDescriptionFormProps = {
  serviceName?: string;
  partitionName?: string;
  partitionDescription?: string;
  isModalOpen: boolean;
  onSuccess: () => void;
};

async function updatePartitionDescription(
  serviceName: string,
  partitionName: string,
  description: string,
): Promise<void> {
  await httpV6.put(`${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}`, {
    partitionDescription: description.trim(),
  });
}

export function useEditDescriptionForm({
  serviceName,
  partitionName,
  partitionDescription,
  isModalOpen,
  onSuccess,
}: UseEditDescriptionFormProps) {
  const { t } = useTranslation(['partition']);

  const descriptionRules = z
    .string()
    .trim()
    .max(DESCRIPTION_MAX, {
      message: t('partition:edit_description.max_length', `Maximum ${DESCRIPTION_MAX} characters`),
    });

  const schema = z.object({
    description: descriptionRules,
  });

  type ValidationSchema = z.infer<typeof schema>;

  const form = useForm<ValidationSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: partitionDescription || '',
    },
  });

  // Reset form when modal opens or description changes
  useEffect(() => {
    if (isModalOpen && partitionDescription !== undefined) {
      form.reset({
        description: partitionDescription || '',
      });
    }
  }, [isModalOpen, partitionDescription, form]);

  const handleSubmit = form.handleSubmit(async (formValues) => {
    if (!serviceName || !partitionName) return;

    try {
      await updatePartitionDescription(serviceName, partitionName, formValues.description);
      onSuccess();
    } catch (err) {
      form.setError('description', {
        message:
          (err as Error).message || t('partition:edit_description.error', 'An error occurred'),
      });
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
