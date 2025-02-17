import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { getProjectRegions } from '@ovh-ux/manager-pci-common';
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

export const useGetRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });

export const useGetAvailableRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'availableRegions'],
    queryFn: () => getAvailableRegions(projectId),
  });

export const useLocations = (projectId: string, onlyAvailable = false) => {
  const query = onlyAvailable
    ? useGetAvailableRegions(projectId)
    : useGetRegions(projectId);

  const {
    translateContinentRegion,
    translateMacroRegion,
  } = useTranslatedMicroRegions();

  return {
    ...query,
    data: useMemo<TPlainLocation[]>(() => {
      const payload = (query.data || []).reduce(
        (acc: Map<string, TLocation>, region) => {
          const continent = translateContinentRegion(region.name);
          const location = translateMacroRegion(region.name);

          if (!acc.has(location)) {
            acc.set(location, {
              continent,
              regions: new Set<string>().add(region.name),
            });
          } else {
            acc.get(location).regions.add(region.name);
          }

          return acc;
        },
        new Map<string, TLocation>(),
      );

      return Array.from(payload.entries() || []).reduce(
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
    }, [query.data]),
  };
};
