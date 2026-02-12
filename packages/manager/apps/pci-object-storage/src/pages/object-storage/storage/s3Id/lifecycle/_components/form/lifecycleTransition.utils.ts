export const TRANSITION_STORAGE_CLASSES = [
  'STANDARD_IA',
  'GLACIER_IR',
  'DEEP_ARCHIVE',
] as const;

export const STORAGE_CLASS_TIER: Record<string, number> = {
  STANDARD_IA: 0,
  GLACIER_IR: 1,
  DEEP_ARCHIVE: 2,
};

export const MIN_TRANSITION_GAP_DAYS = 30;

interface TransitionLike {
  storageClass?: string;
}

export const getDisabledStorageClasses = (
  transitions: TransitionLike[],
  currentIndex: number,
): Set<string> => {
  const usedByOthers = new Set(
    transitions
      .filter((_, i) => i !== currentIndex)
      .map((t) => t.storageClass ?? ''),
  );

  const maxPreviousTier = transitions
    .slice(0, currentIndex)
    .reduce(
      (max, t) => Math.max(max, STORAGE_CLASS_TIER[t.storageClass ?? ''] ?? 0),
      -1,
    );

  return new Set(
    TRANSITION_STORAGE_CLASSES.filter(
      (sc) =>
        usedByOthers.has(sc) ||
        (STORAGE_CLASS_TIER[sc] ?? 0) <= maxPreviousTier,
    ),
  );
};

export const getRemainingStorageClasses = (
  transitions: TransitionLike[],
): string[] => {
  const usedStorageClasses = new Set(
    transitions.map((t) => t.storageClass ?? '').filter(Boolean),
  );
  const maxUsedTier = transitions.reduce(
    (max, t) => Math.max(max, STORAGE_CLASS_TIER[t.storageClass ?? ''] ?? -1),
    -1,
  );

  return TRANSITION_STORAGE_CLASSES.filter(
    (sc) =>
      !usedStorageClasses.has(sc) &&
      (STORAGE_CLASS_TIER[sc] ?? 0) > maxUsedTier,
  );
};

export const canAddTransition = (transitions: TransitionLike[]): boolean =>
  getRemainingStorageClasses(transitions).length > 0;

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
