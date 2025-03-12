import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@ovh-ux/manager-core-api';
import { useApplicationName } from '@/hooks/useApplicationName/useApplicationName';

type FeatureAvailabilityQueryParams = Partial<{
  app: string;
}>;

const getFeatureAvailability = (
  features: string[],
  params?: FeatureAvailabilityQueryParams,
) =>
  apiClient.aapi.get(`/feature/${features.join(',')}/availability`, {
    params,
  });

const useFeatureAvailability = <T extends string[]>(
  features: T,
  params?: FeatureAvailabilityQueryParams,
) =>
  useQuery({
    queryKey: ['feature-availability', ...features, params],
    queryFn: () => getFeatureAvailability(features, params),
    select: ({ data }) => new Map(features.map((f) => [f, data[f] ?? false])),
  });

export const usePCIFeatureAvailability = (features: string[]) => {
  const applicationName = useApplicationName();
  return useFeatureAvailability(features, { app: applicationName });
};
