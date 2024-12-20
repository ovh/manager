import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMacroRegion } from '@ovh-ux/manager-react-components';
import { useAvailabilities } from '@/api/hooks/useAvailabilities';
import { TRegion } from '@/api/types';

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
