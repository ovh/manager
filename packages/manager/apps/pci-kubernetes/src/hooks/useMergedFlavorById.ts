import { useMemo } from 'react';

import { useMergedKubeFlavors } from './useFlavors';

export const getPriceByDesiredScale = (
  hour?: number,
  month?: number,
  desiredScaling = 0,
): {
  month?: number;
  hour: number;
} | null => {
  if (!hour) return null;
  return {
    hour: hour * desiredScaling,
    ...(month && { month: month * desiredScaling }),
  };
};

type MergedFlavorReturn = ReturnType<typeof useMergedKubeFlavors>['mergedFlavors'][0];

const useMergedFlavorById = <T = MergedFlavorReturn>(
  projectId: string,
  region: string | null,
  flavorId: string | null = null,
  opts?: { select?: (flavor: MergedFlavorReturn) => T },
): T | null => {
  const { mergedFlavors } = useMergedKubeFlavors(projectId, region);

  const flavor = useMemo(
    () => mergedFlavors?.find((f) => f.id === flavorId),
    [mergedFlavors, flavorId],
  );
  if (!flavor) return null;

  return opts?.select ? opts.select(flavor) : (flavor as T);
};

export default useMergedFlavorById;
