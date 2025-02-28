import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { TRegion, useGetProjectRegions } from '@ovh-ux/manager-pci-common';
import { getAvailableRegions } from '@/api/data/region';

type TLocation = {
  continent: string;
  regions: Set<string>;
};

type TPlainLocation = {
  name: string;
  continent: string;
  regions: string[];
};

export const useGetAvailableRegionsQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'availableRegions'],
  queryFn: () => getAvailableRegions(projectId),
});

export const useGetAvailableRegions = (projectId: string) =>
  useQuery(useGetAvailableRegionsQuery(projectId));

const useLocationFilter = () => {
  const {
    translateContinentRegion,
    translateMacroRegion,
  } = useTranslatedMicroRegions();

  return {
    filterRegions: (data: TRegion[]): TPlainLocation[] => {
      const payload: { [key: string]: TLocation } = (data || []).reduce(
        (acc, region: TRegion) => {
          const continent = translateContinentRegion(region.name);
          const location = translateMacroRegion(region.name);
          if (!(location in acc)) {
            acc[location] = {
              continent,
              regions: new Set<string>().add(region.name),
            };
          } else {
            acc[location].regions.add(region.name);
          }
          return acc;
        },
        {},
      );

      return Array.from(Object.entries(payload) || []).reduce(
        (acc: TPlainLocation[], [name, { continent, regions }]) => {
          return [
            ...acc,
            {
              name,
              continent,
              regions: Array.from(regions),
            },
          ];
        },
        [],
      );
    },
  };
};

export const useLocations = (projectId: string) => {
  const { filterRegions } = useLocationFilter();
  const query = useGetProjectRegions(projectId);
  return {
    ...query,
    data: useMemo(() => filterRegions(query.data), [query.data]),
  };
};

export const useAvailableLocations = (projectId: string) => {
  const { filterRegions } = useLocationFilter();
  const query = useGetAvailableRegions(projectId);
  return {
    ...query,
    data: useMemo(() => filterRegions(query.data), [query.data]),
  };
};
