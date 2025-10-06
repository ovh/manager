import { AddReplicationFormValues } from '../new/formAddReplication/useAddReplicationForm.hook';
import { transformTagsToApi } from '../utils/transformTags.util';
import storages, { FormattedStorage } from '@/types/Storages';

interface UseReplicationFormSubmitParams {
  availableDestinations: FormattedStorage[];
  s3Region?: string;
  s3Name?: string;
}

export const useReplicationFormSubmit = ({
  availableDestinations,
  s3Region,
  s3Name,
}: UseReplicationFormSubmitParams) => {
  const buildReplicationRule = (
    formValues: AddReplicationFormValues,
  ): storages.ReplicationRule | null => {
    const selectedDestination = availableDestinations.find(
      (storage) =>
        `${storage.name}:${storage.region}` === formValues.destination,
    );

    if (!selectedDestination || !s3Region || !s3Name) return null;

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
    } = formValues;

    const transformedTags = transformTagsToApi(tags);

    const hasPrefix = isReplicationApplicationLimited && prefix;
    const hasTags =
      isReplicationApplicationLimited &&
      Object.keys(transformedTags).length > 0;
    const hasFilter = hasPrefix || hasTags;

    return {
      id: ruleId,
      status,
      destination: {
        name: selectedDestination.name,
        region: selectedDestination.region,
        ...(useStorageClass && {
          storageClass,
        }),
      },
      deleteMarkerReplication,
      priority: parseInt(priority, 10),
      ...(hasFilter && {
        filter: {
          ...(hasPrefix && { prefix }),
          ...(hasTags && { tags: transformedTags }),
        },
      }),
    };
  };

  return { buildReplicationRule };
};
