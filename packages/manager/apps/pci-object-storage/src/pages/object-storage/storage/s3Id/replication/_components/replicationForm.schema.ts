import { z } from 'zod';
import i18next from 'i18next';
import { TagMap } from '../../../../../../types/Tag';
import storages from '@/types/Storages';

const validIdRegex = /^[\x20-\x7E]{3,255}$/;
const validPrefixRegex = /^[\p{L}\p{N}\p{S}\p{P}\p{M}\p{Z}](?:[\p{L}\p{N}\p{S}\p{P}\p{M}\p{Z}]{0,255})?$/u;

export const createReplicationFormSchema = (t: typeof i18next.t) => {
  return z.object({
    ruleId: z
      .string()
      .min(3, t('ruleIdMinLengthError', { min: 3 }))
      .max(255, t('ruleIdMaxLengthError', { max: 255 }))
      .regex(validIdRegex, t('ruleIdRegexError')),
    destination: z.string().min(1, t('destinationRequired')),
    priority: z.string(),
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
    tags: z.record(z.any()).default({}),
  });
};

export type ReplicationFormValues = Omit<
  z.infer<ReturnType<typeof createReplicationFormSchema>>,
  'tags' | 'status' | 'storageClass' | 'deleteMarkerReplication'
> & {
  tags?: TagMap;
  status: storages.ReplicationRuleStatusEnum;
  storageClass: storages.StorageClassEnum;
  deleteMarkerReplication: storages.ReplicationRuleDeleteMarkerReplicationStatusEnum;
};
