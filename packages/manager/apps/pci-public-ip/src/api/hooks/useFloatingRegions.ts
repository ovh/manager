import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAvailabilities } from '@/api/hooks/useAvailabilities';
import { TRegion } from '@/api/types';

const getMacroRegion = (region: string) => {
  const localZonePattern = /^lz/i;
  let macro;
  if (
    localZonePattern.test(
      region
        .split('-')
        ?.slice(2)
        ?.join('-'),
    )
  ) {
    // The pattern for local zone is <geo_location>-LZ-<datacenter>-<letter>
    // geo_location is EU-WEST, EU-SOUTH, maybe ASIA-WEST in the future
    // datacenter: MAD, BRU
    macro = /\D{2,3}/.exec(
      region
        .split('-')
        ?.slice(3)
        ?.join('-'),
    );
  } else {
    macro = /\D{2,3}/.exec(region);
  }
  return macro ? macro[0].replace('-', '').toUpperCase() : '';
};

export const useFloatingRegions = (projectId: string) => {
  const { t: tRegion } = useTranslation('regions');
  const { data: availabilities, isPending } = useAvailabilities(projectId);

  const [regions, setRegions] = useState([]);

  useEffect(() => {
    if (availabilities) {
      const plansRegions = availabilities.plans
        .find(({ code }) => code === 'floatingip.floatingip.hour.consumption')
        ?.regions.map((region: TRegion) => {
          return {
            ...region,
            macroName: tRegion(
              `manager_components_region_${getMacroRegion(region.name)}`,
            ),
            microName: tRegion(
              `manager_components_region_${getMacroRegion(region.name)}_micro`,
              { micro: region.name },
            ),
            continent: tRegion(
              `manager_components_region_continent_${getMacroRegion(
                region.name,
              )}`,
            ),
          };
        });
      setRegions(() => plansRegions);
    }
  }, [availabilities]);

  return {
    floatingRegions: regions,
    isPending,
  };
};
