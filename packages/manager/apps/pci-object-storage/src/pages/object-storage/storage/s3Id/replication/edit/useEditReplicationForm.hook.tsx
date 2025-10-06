import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import storages, { FormattedStorage } from '@/types/Storages';
import { transformTagsFromApi } from '../utils/transformTags.util';
import {
  createReplicationFormSchema,
  ReplicationFormValues,
} from '../schemas/replicationForm.schema';

export type EditReplicationFormValues = ReplicationFormValues;

interface UseEditReplicationFormParams {
  existingRule?: storages.ReplicationRule;
  availableDestinations: FormattedStorage[];
}

export const useEditReplicationForm = ({
  existingRule,
  availableDestinations,
}: UseEditReplicationFormParams) => {
  const { t } = useTranslation('pci-object-storage/replication');

  const defaultValues = useMemo(
    () => ({
      ruleId: existingRule.id,
      status: existingRule.status,
      priority: existingRule.priority.toString(),
      destination: `${existingRule.destination?.name}:${existingRule.destination?.region}`,
      prefix: existingRule.filter?.prefix || '',
      useStorageClass: !!existingRule.destination?.storageClass,
      storageClass: existingRule.destination?.storageClass,
      deleteMarkerReplication: existingRule.deleteMarkerReplication,
      isReplicationApplicationLimited: !!existingRule.filter,
      tags: transformTagsFromApi(existingRule.filter?.tags),
    }),
    [existingRule, availableDestinations.length],
  );

  const form = useForm<EditReplicationFormValues>({
    resolver: zodResolver(createReplicationFormSchema(t)),
    defaultValues,
  });

  return { form };
};
