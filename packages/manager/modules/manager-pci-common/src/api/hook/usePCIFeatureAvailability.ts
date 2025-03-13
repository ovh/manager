import { useQuery } from '@tanstack/react-query';
import { useApplicationName } from '@/hooks/useApplicationName/useApplicationName';
import {
  FeatureAvailabilityQueryParams,
  getFeatureAvailability,
} from '@/api/data/feature-availability';

const useFeatureAvailability = <T extends string = string>(
  features: T[],
  params?: FeatureAvailabilityQueryParams,
) =>
  useQuery({
    queryKey: ['feature-availability', ...features, params],
    queryFn: () => getFeatureAvailability(features, params),
    select: ({ data }) =>
      new Map<T, boolean>(features.map((f) => [f, data[f] ?? false])),
  });

export const usePCIFeatureAvailability = <T extends string = string>(
  features: T[],
) => {
  const applicationName = useApplicationName();
  return useFeatureAvailability(features, { app: applicationName });
};
