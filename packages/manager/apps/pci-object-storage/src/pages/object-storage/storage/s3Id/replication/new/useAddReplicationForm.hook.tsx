import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import storages from '@/types/Storages';
import {
  createReplicationFormSchema,
  ReplicationFormValues,
} from '../_components/replicationForm.schema';

export type AddReplicationFormValues = ReplicationFormValues;

export const useAddReplicationForm = () => {
  const { t } = useTranslation('pci-object-storage/replication');

  const form = useForm<AddReplicationFormValues>({
    resolver: zodResolver(createReplicationFormSchema(t)),
    defaultValues: {
      ruleId: '',
      destination: '',
      priority: '1',
      prefix: '',
      useStorageClass: false,
      storageClass: storages.StorageClassEnum.STANDARD,
      status: storages.ReplicationRuleStatusEnum.enabled,
      deleteMarkerReplication:
        storages.ReplicationRuleDeleteMarkerReplicationStatusEnum.disabled,
      isReplicationApplicationLimited: false,
      tags: {},
    },
  });

  return { form };
};
