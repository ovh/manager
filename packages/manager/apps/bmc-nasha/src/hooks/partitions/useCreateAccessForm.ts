import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useCreateAccess } from './useCreateAccess';

type UseCreateAccessFormProps = {
  serviceName?: string;
  partitionName?: string;
  onSuccess: (taskId?: string | number) => void;
};

const createAccessSchema = (t: (key: string, fallback: string) => string) =>
  z.object({
    ip: z.string().min(1, {
      message: t('partition:accesses.create.errors.ip_required', 'IP is required'),
    }),
    type: z.string().min(1, {
      message: t('partition:accesses.create.errors.type_required', 'Type is required'),
    }),
    description: z.string().optional(),
  });

type FormValues = z.infer<ReturnType<typeof createAccessSchema>>;

export function useCreateAccessForm({
  serviceName,
  partitionName,
  onSuccess,
}: UseCreateAccessFormProps) {
  const { t } = useTranslation(['partition']);
  const createAccessMutation = useCreateAccess();

  const schema = createAccessSchema(t);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ip: '',
      type: 'readwrite',
      description: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!serviceName || !partitionName) return;

    try {
      const result = await createAccessMutation.mutateAsync({
        serviceName,
        partitionName,
        ip: data.ip.trim(),
        type: data.type,
        aclDescription: data.description?.trim() || undefined,
      });

      const taskId = result?.taskId || result?.id;
      onSuccess(taskId);
    } catch (err) {
      form.setError('root', {
        message:
          (err as Error).message ||
          t('partition:accesses.create.errors.submit_failed', 'An error occurred'),
      });
      throw err;
    }
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
