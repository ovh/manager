import { useMemo } from 'react';
import { useMergedKubeFlavors } from './useFlavors';
import { TComputedKubeFlavor } from '@/components/flavor-selector/FlavorSelector.component';

export const getPriceByDesiredScale = (
  hour?: number,
  month?: number,
  desiredScaling = 0,
) => {
  if (!hour || !desiredScaling) return undefined;
  return {
    hour: hour * desiredScaling,
    month: month ? month * desiredScaling : undefined,
  };
};

const useMergedFlavorById = <T = TComputedKubeFlavor>(
  projectId: string,
  region: string,
  flavorId: string,
  opts?: { select?: (flavor: TComputedKubeFlavor) => T },
): T | null => {
  const { mergedFlavors } = useMergedKubeFlavors(projectId, region);

  const flavor = useMemo(() => mergedFlavors?.find((f) => f.id === flavorId), [
    mergedFlavors,
    flavorId,
  ]);
  if (!flavor) return null;

  return opts?.select ? opts?.select(flavor) : (flavor as T);
};

export default useMergedFlavorById;
