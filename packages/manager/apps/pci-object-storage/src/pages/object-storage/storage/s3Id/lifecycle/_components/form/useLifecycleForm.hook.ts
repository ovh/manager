import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag } from '@/types/Tag';
import { createLifecycleSchema } from './lifecycleForm.schema';
import storages from '@/types/Storages';

type InferSchema<T> = T extends z.ZodTypeAny ? z.infer<T> : never;

type BuildLifecycleFormValues<T extends z.ZodTypeAny> = Omit<
  InferSchema<T>,
  'tags'
> & {
  tags: Tag[];
};

type LifecycleSchemaValues = z.infer<ReturnType<typeof createLifecycleSchema>>;

interface UseLifecycleFormParams {
  existingRule?: storages.LifecycleRule;
}

export const useLifecycleForm = ({ existingRule }: UseLifecycleFormParams) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/lifecycle');

  const schema = createLifecycleSchema(t);

  const emptyTags: Tag[] = [];

  const defaultValues = useMemo(() => {
    const base = {
      ruleId: '',
      status: 'enabled' as const,
      hasFilter: false,
      prefix: '',
      tags: emptyTags,
      hasCurrentVersionTransitions: false,
      transitions: [] as LifecycleSchemaValues['transitions'],
      hasCurrentVersionExpiration: false,
      expirationDays: 0,
      expiredObjectDeleteMarker: false,
      hasNoncurrentVersionTransitions: false,
      noncurrentVersionTransitions: [] as LifecycleSchemaValues['noncurrentVersionTransitions'],
      hasNoncurrentVersionExpiration: false,
      noncurrentVersionExpirationDays: 0,
      noncurrentVersionExpirationNewerVersions: 0,
      hasObjectSizeGreaterThan: false,
      objectSizeGreaterThan: 0,
      hasObjectSizeLessThan: false,
      objectSizeLessThan: 0,
      hasAbortIncompleteMultipartUpload: false,
      abortDaysAfterInitiation: 0,
    };

    if (!existingRule) {
      return base;
    }

    const hasCurrentVersionTransitions = Boolean(
      existingRule.transitions?.length,
    );
    const hasCurrentVersionExpiration = Boolean(
      existingRule.expiration?.days ||
        existingRule.expiration?.expiredObjectDeleteMarker,
    );
    const hasNoncurrentVersionTransitions = Boolean(
      existingRule.noncurrentVersionTransitions?.length,
    );
    const hasNoncurrentVersionExpiration = Boolean(
      existingRule.noncurrentVersionExpiration?.noncurrentDays,
    );
    const hasAbort = Boolean(
      existingRule.abortIncompleteMultipartUpload?.daysAfterInitiation,
    );
    const hasFilter = Boolean(
      existingRule.filter?.prefix ||
        (existingRule.filter?.tags &&
          Object.keys(existingRule.filter.tags).length > 0) ||
        existingRule.filter?.objectSizeGreaterThan ||
        existingRule.filter?.objectSizeLessThan,
    );

    return {
      ...base,
      ruleId: existingRule.id,
      status: existingRule.status,
      hasFilter,
      prefix: existingRule.filter?.prefix ?? '',
      tags: Object.entries(
        existingRule.filter?.tags ?? {},
      ).map(([key, value]) => ({ key, value })),
      hasObjectSizeGreaterThan: Boolean(
        existingRule.filter?.objectSizeGreaterThan,
      ),
      objectSizeGreaterThan:
        existingRule.filter?.objectSizeGreaterThan ?? 0,
      hasObjectSizeLessThan: Boolean(
        existingRule.filter?.objectSizeLessThan,
      ),
      objectSizeLessThan: existingRule.filter?.objectSizeLessThan ?? 0,
      hasCurrentVersionTransitions,
      transitions: (existingRule.transitions ?? []).map((tr) => ({
        days: tr.days ?? 0,
        storageClass: (tr.storageClass as unknown) as storages.StorageClassEnum,
      })),
      hasCurrentVersionExpiration,
      expirationDays: existingRule.expiration?.days ?? 0,
      expiredObjectDeleteMarker:
        existingRule.expiration?.expiredObjectDeleteMarker ?? false,
      hasNoncurrentVersionTransitions,
      noncurrentVersionTransitions: (
        existingRule.noncurrentVersionTransitions ?? []
      ).map((tr) => ({
        noncurrentDays: tr.noncurrentDays ?? 0,
        storageClass: tr.storageClass,
        newerNoncurrentVersions: tr.newerNoncurrentVersions ?? 0,
      })),
      hasNoncurrentVersionExpiration,
      noncurrentVersionExpirationDays:
        existingRule.noncurrentVersionExpiration?.noncurrentDays ?? 0,
      noncurrentVersionExpirationNewerVersions:
        existingRule.noncurrentVersionExpiration?.newerNoncurrentVersions ?? 0,
      hasAbortIncompleteMultipartUpload: hasAbort,
      abortDaysAfterInitiation:
        existingRule.abortIncompleteMultipartUpload?.daysAfterInitiation ?? 0,
    };
  }, [existingRule]);

  const form = useForm<BuildLifecycleFormValues<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues,
  });

  return { schema, form };
};

export type LifecycleFormValues = BuildLifecycleFormValues<
  ReturnType<typeof useLifecycleForm>['schema']
>;
