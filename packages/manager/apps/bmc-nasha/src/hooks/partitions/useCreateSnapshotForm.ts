import { useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { type UseFormReturn, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useCreateSnapshot } from './useCreateSnapshot';

const CUSTOM_SNAPSHOT_NAME_PATTERN = /^[a-zA-Z0-9.:-]+$/;
const CUSTOM_SNAPSHOT_NAME_PREFIX = 'snap';
const CUSTOM_SNAPSHOT_NAME_SEPARATOR = '-';
const MAX_CUSTOM_SNAPSHOT = 10;

type UseCreateSnapshotFormProps = {
  serviceName?: string;
  partitionName?: string;
  currentSnapshotCount: number;
  defaultName: string;
  onSuccess: (taskId?: string | number) => void;
};

// Extract schema creation logic
function createSnapshotSchema(
  t: ReturnType<typeof useTranslation>['t'],
  canCreateSnapshot: boolean,
) {
  return z.object({
    snapshotName: z
      .string()
      .min(1, {
        message: t('partition:snapshots.create.errors.name_required', 'Name is required'),
      })
      .regex(CUSTOM_SNAPSHOT_NAME_PATTERN, {
        message: t(
          'partition:snapshots.create.errors.name_invalid',
          'Name must contain only alphanumeric characters, dots, colons, and hyphens',
        ),
      })
      .refine(() => canCreateSnapshot, {
        message: t('partition:snapshots.create.errors.max_reached', {
          max: MAX_CUSTOM_SNAPSHOT,
        }),
      }),
  });
}

type SubmitHandlerParams<T extends { snapshotName: string }> = {
  form: UseFormReturn<T>;
  createSnapshotMutation: ReturnType<typeof useCreateSnapshot>;
  serviceName: string | undefined;
  partitionName: string | undefined;
  onSuccess: (taskId?: string | number) => void;
  t: ReturnType<typeof useTranslation>['t'];
};

// Extract submit handler logic
function createSubmitHandler<T extends { snapshotName: string }>(params: SubmitHandlerParams<T>) {
  const { form, createSnapshotMutation, serviceName, partitionName, onSuccess, t } = params;

  return form.handleSubmit(async (data) => {
    if (!serviceName || !partitionName) return;

    const fullSnapshotName = [CUSTOM_SNAPSHOT_NAME_PREFIX, data.snapshotName.trim()].join(
      CUSTOM_SNAPSHOT_NAME_SEPARATOR,
    );

    try {
      const result = await createSnapshotMutation.mutateAsync({
        serviceName,
        partitionName,
        name: fullSnapshotName,
      });

      const taskId = result?.taskId || result?.id;
      onSuccess(taskId);
    } catch (err) {
      form.setError('root', {
        message:
          (err as Error).message ||
          t('partition:snapshots.create.errors.submit_failed', 'An error occurred'),
      });
      throw err;
    }
  });
}

export function useCreateSnapshotForm({
  serviceName,
  partitionName,
  currentSnapshotCount,
  defaultName,
  onSuccess,
}: UseCreateSnapshotFormProps) {
  const { t } = useTranslation(['partition']);
  const createSnapshotMutation = useCreateSnapshot();

  const canCreateSnapshot = currentSnapshotCount < MAX_CUSTOM_SNAPSHOT;

  const schema = useMemo(() => createSnapshotSchema(t, canCreateSnapshot), [t, canCreateSnapshot]);

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      snapshotName: defaultName,
    },
  });

  const handleSubmit = createSubmitHandler({
    form,
    createSnapshotMutation,
    serviceName,
    partitionName,
    onSuccess,
    t,
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    canCreateSnapshot,
  };
}

export { MAX_CUSTOM_SNAPSHOT, CUSTOM_SNAPSHOT_NAME_PREFIX, CUSTOM_SNAPSHOT_NAME_SEPARATOR };
