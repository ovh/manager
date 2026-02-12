import storages from '@/types/Storages';
import { LifecycleFormValues } from './useLifecycleForm.hook';

export const buildLifecycleRule = (
  formValues: LifecycleFormValues,
): storages.LifecycleRule | null => {
  const {
    ruleId,
    status,
    hasFilter,
    prefix,
    tags,
    hasCurrentVersionTransitions,
    transitions,
    hasCurrentVersionExpiration,
    expirationDays,
    expiredObjectDeleteMarker,
    hasNoncurrentVersionTransitions,
    noncurrentVersionTransitions,
    hasNoncurrentVersionExpiration,
    noncurrentVersionExpirationDays,
    hasAbortIncompleteMultipartUpload,
    abortDaysAfterInitiation,
  } = formValues;

  if (!ruleId) return null;

  const filteredTags = (tags || [])
    .filter((tag) => tag.key.trim() !== '')
    .reduce(
      (acc, { key, value }) => ({ ...acc, [key]: value }),
      {} as Record<string, string>,
    );

  const hasPrefix = hasFilter && prefix;
  const hasTags = hasFilter && Object.keys(filteredTags).length > 0;
  const hasFilterData = hasPrefix || hasTags;

  const rule: storages.LifecycleRule = {
    id: ruleId,
    status: status as storages.LifecycleRuleStatusEnum,
    ...(hasFilterData && {
      filter: {
        ...(hasPrefix && { prefix }),
        ...(hasTags && { tags: filteredTags }),
      },
    }),
    ...(hasCurrentVersionTransitions &&
      transitions.length > 0 && {
        transitions: transitions
          .filter((t) => t.days > 0)
          .map((t) => ({
            days: t.days,
            storageClass: t.storageClass as storages.LifecycleRuleTransitionStorageClassEnum,
          })),
      }),
    ...((hasCurrentVersionExpiration && expirationDays > 0) ||
    expiredObjectDeleteMarker
      ? {
          expiration: {
            ...(hasCurrentVersionExpiration &&
              expirationDays > 0 && { days: expirationDays }),
            ...(expiredObjectDeleteMarker && {
              expiredObjectDeleteMarker: true,
            }),
          },
        }
      : {}),
    ...(hasNoncurrentVersionTransitions &&
      noncurrentVersionTransitions.length > 0 && {
        noncurrentVersionTransitions: noncurrentVersionTransitions
          .filter((t) => t.noncurrentDays > 0)
          .map((t) => ({
            noncurrentDays: t.noncurrentDays,
            storageClass: t.storageClass as storages.StorageClassEnum,
          })),
      }),
    ...(hasNoncurrentVersionExpiration &&
      noncurrentVersionExpirationDays > 0 && {
        noncurrentVersionExpiration: {
          noncurrentDays: noncurrentVersionExpirationDays,
        },
      }),
    ...(hasAbortIncompleteMultipartUpload &&
      abortDaysAfterInitiation > 0 && {
        abortIncompleteMultipartUpload: {
          daysAfterInitiation: abortDaysAfterInitiation,
        },
      }),
  };

  return rule;
};
