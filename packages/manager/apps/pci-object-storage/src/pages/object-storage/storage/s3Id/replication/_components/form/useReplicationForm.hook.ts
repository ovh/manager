import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import storages from '@/types/Storages';
import { Tag } from '@/types/Tag';
import { getContainerHelper } from '@/data/hooks/s3-storage/getContainerHelper';
import { useS3Data } from '../../../S3.context';

const validIdRegex = /^[\x20-\x7E]{3,255}$/;
const validPrefixRegex = /^[\p{L}\p{N}\p{S}\p{P}\p{M}\p{Z}](?:[\p{L}\p{N}\p{S}\p{P}\p{M}\p{Z}]{0,255})?$/u;

type InferSchema<T> = T extends z.ZodTypeAny ? z.infer<T> : never;
type BuildReplicationFormValues<T extends z.ZodTypeAny> = Omit<
  InferSchema<T>,
  'tags' | 'status' | 'storageClass' | 'deleteMarkerReplication'
> & {
  tags: Tag[];
  status: storages.ReplicationRuleStatusEnum;
  storageClass: storages.StorageClassEnum;
  deleteMarkerReplication: storages.ReplicationRuleDeleteMarkerReplicationStatusEnum;
};

interface UseReplicationFormParams {
  existingRule?: storages.ReplicationRule;
}

export const useReplicationForm = ({
  existingRule,
}: UseReplicationFormParams) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/replication');
  const { projectId } = useParams();
  const queryClient = useQueryClient();
  const { s3: currentS3 } = useS3Data();
  const schema = z
    .object({
      ruleId: z
        .string()
        .min(3, t('ruleIdMinLengthError', { min: 3 }))
        .max(255, t('ruleIdMaxLengthError', { max: 255 }))
        .regex(validIdRegex, t('ruleIdRegexError')),
      destination: z.object({
        name: z.string(),
        region: z.string(),
      }),
      priority: z.coerce
        .number()
        .int()
        .min(1)
        .max(999),
      prefix: z
        .string()
        .regex(validPrefixRegex, t('prefixRegexError'))
        .optional()
        .or(z.literal('')),
      useStorageClass: z.boolean().default(false),
      storageClass: z
        .nativeEnum(storages.StorageClassEnum)
        .default(storages.StorageClassEnum.STANDARD),
      status: z
        .nativeEnum(storages.ReplicationRuleStatusEnum)
        .default(storages.ReplicationRuleStatusEnum.enabled),
      deleteMarkerReplication: z
        .nativeEnum(storages.ReplicationRuleDeleteMarkerReplicationStatusEnum)
        .default(
          storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.disabled,
        ),
      isReplicationApplicationLimited: z.boolean().default(false),
      tags: z
        .array(z.object({ key: z.string(), value: z.string() }))
        .default([]),
    })
    .superRefine(async (data, ctx) => {
      if (!data.destination.name || !data.destination.region) {
        ctx.addIssue({
          path: ['destination'],
          code: z.ZodIssueCode.custom,
          message: t('destinationRequired'),
        });
        return;
      }

      try {
        const s3 = await getContainerHelper(
          queryClient,
          projectId,
          data.destination.region,
          data.destination.name,
        );

        if (s3.versioning?.status !== 'enabled') {
          ctx.addIssue({
            path: ['destination'],
            code: z.ZodIssueCode.custom,
            message: t('errorDestinationVersioningDisabled'),
          });
        }

        if (
          currentS3.objectLock?.status === 'enabled' &&
          !(s3.objectLock?.status === 'enabled')
        ) {
          ctx.addIssue({
            path: ['destination'],
            code: z.ZodIssueCode.custom,
            message: t('errorDestinationObjectLockDisabled'),
          });
        }
      } catch {
        ctx.addIssue({
          path: ['destination'],
          code: z.ZodIssueCode.custom,
          message: t('errorDestinationFetchingDetails'),
        });
      }
    });

  const emptyTags: Tag[] = [];

  const defaultValues = useMemo(() => {
    const base = {
      ruleId: '',
      destination: { name: '', region: '' },
      priority: 1,
      prefix: '',
      useStorageClass: false,
      storageClass: storages.StorageClassEnum.STANDARD,
      status: storages.ReplicationRuleStatusEnum.enabled,
      deleteMarkerReplication:
        storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.disabled,
      isReplicationApplicationLimited: false,
      tags: emptyTags,
    };

    if (!existingRule) {
      return base;
    }

    return {
      ...base,
      ruleId: existingRule.id,
      status: existingRule.status,
      priority: existingRule.priority,
      destination: {
        name: existingRule.destination.name,
        region: existingRule.destination.region,
      },
      prefix: existingRule.filter?.prefix ?? '',
      useStorageClass: !!existingRule.destination?.storageClass,
      storageClass:
        existingRule.destination?.storageClass ??
        storages.StorageClassEnum.STANDARD,
      deleteMarkerReplication: existingRule.deleteMarkerReplication,
      isReplicationApplicationLimited: !!existingRule.filter,
      tags: Object.entries(
        existingRule.filter?.tags ?? {},
      ).map(([key, value]) => ({ key, value })),
    };
  }, [existingRule]);

  const form = useForm<BuildReplicationFormValues<typeof schema>>({
    resolver: zodResolver(schema, {
      async: true,
    }),

    mode: 'onChange',
    defaultValues,
  });

  return { schema, form };
};

export type ReplicationFormValues = BuildReplicationFormValues<
  ReturnType<typeof useReplicationForm>['schema']
>;
