import storages from '@/types/Storages';
import { ReplicationFormValues } from './useReplicationForm.hook';

export const buildReplicationRule = (
  formValues: ReplicationFormValues,
): storages.ReplicationRule | null => {
  const {
    tags,
    prefix,
    isReplicationApplicationLimited,
    status,
    ruleId,
    useStorageClass,
    storageClass,
    deleteMarkerReplication,
    priority,
    destination,
  } = formValues;

  const filteredTags = (tags || [])
    .filter((tag) => tag.key.trim() !== '')
    .reduce(
      (acc, { key, value }) => ({ ...acc, [key]: value }),
      {} as Record<string, string>,
    );

  const hasPrefix = isReplicationApplicationLimited && prefix;
  const hasTags =
    isReplicationApplicationLimited && Object.keys(filteredTags).length > 0;
  const hasFilter = hasPrefix || hasTags;

  return {
    id: ruleId,
    status,
    destination: {
      name: destination.name,
      region: destination.region,
      ...(useStorageClass && {
        storageClass,
      }),
    },
    deleteMarkerReplication,
    priority,
    ...(hasFilter && {
      filter: {
        ...(hasPrefix && { prefix }),
        ...(hasTags && { tags: filteredTags }),
      },
    }),
  };
};
