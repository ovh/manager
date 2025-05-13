import { useQuery } from '@tanstack/react-query';
import {
  getAvailabilities,
  getAvailabilitiesUrl,
} from '@/api/data/availabilities';
import { useMe } from '@/api/hooks/useMe';

export const getAvailabilitiesQuery = (
  projectId: string,
  ovhSubsidiary: string,
) => ({
  queryKey: [getAvailabilitiesUrl(projectId, ovhSubsidiary)],
  queryFn: () => getAvailabilities(projectId, ovhSubsidiary),
});

export const useAvailabilities = (projectId: string) => {
  const { me } = useMe();
  return useQuery({
    ...getAvailabilitiesQuery(projectId, me?.ovhSubsidiary),
    enabled: !!me?.ovhSubsidiary,
  });
};
