import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useGetPrivateNetworks } from '@/api/hook/useNetwork';
import { SIZE_FLAVOUR_REGEX } from '@/constants';
import { useGetPlans } from '@/api/hook/usePlans';

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
export const useGetRegions = (
  projectId: string,
): { data: Map<string, TRegion[]>; isPending: boolean } => {
  const {
    data: plansResponse,
    isPending: isPlansResponsePending,
  } = useGetPlans(projectId);
  const {
    data: networks,
    isPending: isNetworksPending,
  } = useGetPrivateNetworks(projectId);
  const { t: tRegion } = useTranslation('regions');

  return {
    data: useMemo(() => {
      const regions = new Map();
      if (plansResponse && networks) {
        plansResponse?.plans.forEach((plan) => {
          const match = plan.code.match(SIZE_FLAVOUR_REGEX);
          if (match) {
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
      return regions;
    }, [plansResponse, networks]),
    isPending: isPlansResponsePending || isNetworksPending,
  };
};
