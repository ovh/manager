import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslatedMicroRegions } from '@ovh-ux/manager-react-components';
import { getRegions } from '@/api/data/region';

type TLocation = {
  continent: string;
  regions: Set<string>;
};

type TPlainLocation = {
  name: string;
  continent: string;
  regions: string[];
};

export const useGetProjectRegions = (
  projectId: string,
  onlyAvailable = false,
) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'regions',
      onlyAvailable ? 'available' : 'all',
    ],
    queryFn: () => getRegions(projectId, onlyAvailable),
  });

export const useLocations = (projectId: string, onlyAvailable = false) => {
  const query = useGetProjectRegions(projectId, onlyAvailable);

  const {
    translateContinentRegion,
    translateMacroRegion,
  } = useTranslatedMicroRegions();

  return {
    ...query,
    data: useMemo<TPlainLocation[]>(() => {
      const payload = query.data?.reduce(
        (acc: Map<string, TLocation>, region) => {
          const continent = translateContinentRegion(region.name);
          const location = translateMacroRegion(region.name).split(' ')[0];

          if (!acc.has(location)) {
            acc.set(location, {
              continent,
              regions: new Set<string>().add(region.name),
            });
          } else {
            acc.get(location)?.regions.add(region.name);
          }

          return acc;
        },
        new Map<string, TLocation>(),
      );

      return Array.from(payload?.keys() || []).reduce(
        (acc: TPlainLocation[], name) => {
          return [
            ...acc,
            {
              name,
              continent: payload.get(name).continent,
              regions: Array.from(payload.get(name).regions),
            },
          ];
        },
        [],
      );
    }, [query.data]),
  };
};
