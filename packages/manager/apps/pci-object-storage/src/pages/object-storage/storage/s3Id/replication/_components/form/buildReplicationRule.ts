import { transformTagsToApi } from '../../../../../../../lib/transformTagsHelper';
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

  const transformedTags = transformTagsToApi(tags);

  const hasPrefix = isReplicationApplicationLimited && prefix;
  const hasTags =
    isReplicationApplicationLimited && Object.keys(transformedTags).length > 0;
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
        ...(hasTags && { tags: transformedTags }),
      },
    }),
  };
};
