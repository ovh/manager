import storages from '@/types/Storages';
import { STORAGE_CLASS_TIER } from '@/hooks/useAvailableStorageClasses.hook';

export const MIN_TRANSITION_GAP_DAYS = 30;

interface TransitionLike {
  storageClass?: storages.StorageClassEnum;
}

const getTier = (sc?: storages.StorageClassEnum): number =>
  sc ? STORAGE_CLASS_TIER[sc] : -1;

export const getDisabledStorageClasses = (
  availableStorageClasses: storages.StorageClassEnum[],
  transitions: TransitionLike[],
  currentIndex: number,
): Set<storages.StorageClassEnum> => {
  const usedByOthers = new Set(
    transitions
      .filter((_, i) => i !== currentIndex)
      .map((t) => t.storageClass)
      .filter(Boolean),
  );

  const maxPreviousTier = transitions
    .slice(0, currentIndex)
    .reduce((max, t) => Math.max(max, getTier(t.storageClass)), -1);

  return new Set(
    availableStorageClasses.filter(
      (sc) => usedByOthers.has(sc) || STORAGE_CLASS_TIER[sc] <= maxPreviousTier,
    ),
  );
};

export const getRemainingStorageClasses = (
  availableStorageClasses: storages.StorageClassEnum[],
  transitions: TransitionLike[],
): storages.StorageClassEnum[] => {
  const usedStorageClasses = new Set(
    transitions.map((t) => t.storageClass).filter(Boolean),
  );
  const maxUsedTier = transitions.reduce(
    (max, t) => Math.max(max, getTier(t.storageClass)),
    -1,
  );

  return availableStorageClasses.filter(
    (sc) => !usedStorageClasses.has(sc) && STORAGE_CLASS_TIER[sc] > maxUsedTier,
  );
};

export const canAddTransition = (
  availableStorageClasses: storages.StorageClassEnum[],
  transitions: TransitionLike[],
): boolean =>
  getRemainingStorageClasses(availableStorageClasses, transitions).length > 0;

export const getMaxTransitionDays = (
  transitions: { days?: number }[],
): number => transitions.reduce((max, t) => Math.max(max, t.days ?? 0), 0);

export const getNextTransitionDays = (
  transitions: { days?: number }[],
): number => {
  const lastTransition = transitions[transitions.length - 1];
  return lastTransition
    ? (lastTransition.days ?? 0) + MIN_TRANSITION_GAP_DAYS
    : MIN_TRANSITION_GAP_DAYS;
};
