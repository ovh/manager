import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getPlans } from '../data/plans';
import { SIZE_FLAVOUR_REGEX } from '@/constants';
import { useGetPrivateNetworks } from '@/api/hook/useNetwork';

export const useGetPlans = (projectId: string) => {
  const { me } = useMe();
  return useQuery({
    queryKey: ['project', projectId, 'plans'],
    queryFn: () => getPlans(projectId, me?.ovhSubsidiary),
    enabled: !!me,
    throwOnError: true,
  });
};

export type TRegion = {
  name: string;
  isEnabled: boolean;
  continentCode: string;
  macroName: string;
  microName: string;
  continent: string;
};
const getMacroRegion = (region: string) => {
  const regionSubStrings = region.split('-');

  const macroRegionMap = [
    null,
    regionSubStrings[0].split(/(\d)/)[0],
    regionSubStrings[0],
    regionSubStrings[2],
    regionSubStrings[2] === 'LZ' ? regionSubStrings[3] : regionSubStrings[2],
    regionSubStrings[3],
  ];
  return macroRegionMap[regionSubStrings.length] || 'Unknown_Macro_Region';
};
export const useGetRegions = (projectId: string): Map<string, TRegion[]> => {
  const { data: response } = useGetPlans(projectId);
  const { data: networks } = useGetPrivateNetworks(projectId);
  const { t: tRegion } = useTranslation('regions');

  return useMemo(() => {
    const regions = new Map();
    if (response && networks) {
      response?.plans.forEach((plan) => {
        const match = plan.code.match(SIZE_FLAVOUR_REGEX);
        if (match) {
          // plan is included
          const code = match[1];
          if (!regions.has(code)) {
            regions.set(code, []);
          }
          plan.regions.forEach((region) => {
            regions.get(code).push({
              name: region.name,
              isEnabled: networks.some((network) =>
                network.regions.some((r) => r.region === region.name),
              ),
              continentCode: region.continentCode,
              macroName: tRegion(
                `manager_components_region_${getMacroRegion(region.name)}`,
              ),
              microName: tRegion(
                `manager_components_region_${getMacroRegion(
                  region.name,
                )}_micro`,
                { micro: region.name },
              ),
              continent: tRegion(
                `manager_components_region_continent_${getMacroRegion(
                  region.name,
                )}`,
              ),
            });
          });
        }
      });
    }
    console.log(regions);
    return regions;
  }, [response, networks]);
};
