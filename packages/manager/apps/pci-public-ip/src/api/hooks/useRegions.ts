import { useMemo } from 'react';
import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { useProductAvailability, useProject } from '@ovh-ux/manager-pci-common';
import { useQuery } from '@tanstack/react-query';

export interface Region {
  name: string;
  ipCountries: string[];
}

const getUrl = (projectId: string) => `/cloud/project/${projectId}/region`;

export const getRegions = async (projectId: string): Promise<Region[]> => {
  const { data } = await fetchIcebergV6<Region>({
    route: getUrl(projectId),
  });
  return data as Region[];
};

export const getRegionsQuery = (projectId: string) => ({
  queryKey: [getUrl(projectId)],
  queryFn: () => getRegions(projectId),
});

export const useRegions = (projectId: string) =>
  useQuery(getRegionsQuery(projectId));

export const useAvailableHourlyPlansRegion = (regionName: string) => {
  const { data: project } = useProject();
  const { data } = useProductAvailability(project.project_id, {
    addonFamily: 'gateway',
  });

  return useMemo(() => {
    const plans = data?.plans.filter(({ code }) => code.includes('hour')) || [];
    const plansRegion =
      plans.filter((plan) =>
        plan.regions.some((region) => region.name === regionName),
      ) || [];

    return plansRegion.map((item) => item.code);
  }, [data, regionName]);
};
