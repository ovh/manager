import { useMemo } from 'react';

import { useOkmsList } from '@key-management-service/data/hooks/useOkms';
import { useNotificationAddErrorOnce } from '@key-management-service/hooks/useNotificationAddErrorOnce';
import { OKMS } from '@key-management-service/types/okms.type';
import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';

import { useLocations } from '@/common/data/hooks/useLocation';
import { Location } from '@/common/types/location.type';
import { ContinentCode } from '@/common/utils/location/continents';
import { getContinentCodeFromGeographyCode } from '@/common/utils/location/continents';
import { findLocationByRegion } from '@/modules/secret-manager/utils/location';

export type RegionOption = {
  region: string;
  continentCode: ContinentCode;
  href: string;
};

export type GeographyGroup = {
  continentCode: ContinentCode;
  regions: RegionOption[];
};

type UseRegionSelectorReturn = {
  geographyGroups: GeographyGroup[];
  currentRegion: RegionOption | undefined;
  isLoading: boolean;
  isError: boolean;
};

/**
 * Builds a list of regions with an available okms
 * Locations are used to get the region name and geography label
 */
const buildRegionOptions = (locations: Location[], okmsList: OKMS[]): RegionOption[] => {
  // Deduplicate regions
  const uniqueRegions = [...new Set(okmsList.map((okms) => okms.region))];

  return uniqueRegions
    .map((region) => {
      const location = findLocationByRegion(locations, region);
      if (!location) return null;

      // get the first okms in the region
      const regionOkmsList = okmsList.filter((okms) => okms.region === region);
      const firstOkms = regionOkmsList[0]!; // we know that there is a okms in the region

      return {
        region: location.name,
        continentCode: getContinentCodeFromGeographyCode(location.geographyCode),
        href:
          // If only one okms is available, redirect to its secrets listing page
          // Otherwise, redirect to the region page that displays the okms list
          regionOkmsList.length === 1
            ? SECRET_MANAGER_ROUTES_URLS.secretList(firstOkms.id)
            : SECRET_MANAGER_ROUTES_URLS.okmsList(region),
      };
    })
    .filter((option): option is RegionOption => option !== null);
};

/**
 * Group regionsOptions by geographyLabel (e.g., "Europe", "North America")
 */
const groupRegionOptions = (regionOptions: RegionOption[]): GeographyGroup[] => {
  return regionOptions.reduce<GeographyGroup[]>((acc, regionOption) => {
    const existingRegion = acc.find((group) => group.continentCode === regionOption.continentCode);

    if (existingRegion) {
      existingRegion.regions.push(regionOption);
    } else {
      acc.push({
        continentCode: regionOption.continentCode,
        regions: [regionOption],
      });
    }

    return acc;
  }, []);
};

const findCurrentRegionOption = (
  regionOptions: RegionOption[],
  currentRegion: string | undefined,
): RegionOption | undefined => {
  if (!currentRegion) {
    // Return the first region if no currentRegion is specified
    return regionOptions[0];
  }

  return regionOptions.find((region) => region.region === currentRegion);
};

export const useRegionSelector = (): UseRegionSelectorReturn => {
  const { data: locations, isPending: isPendingLocations, error: errorLocations } = useLocations();
  const { data: okmsList, isPending: isPendingOkmsList, error: errorOkmsList } = useOkmsList();

  const currentRegionId = useCurrentRegion(okmsList || []);

  const isLoading = isPendingLocations || isPendingOkmsList;

  const { geographyGroups, currentRegion } = useMemo(() => {
    if (!locations || !okmsList) {
      return { geographyGroups: [], currentRegion: undefined };
    }

    const regionOptions = buildRegionOptions(locations, okmsList);
    return {
      geographyGroups: groupRegionOptions(regionOptions),
      currentRegion: findCurrentRegionOption(regionOptions, currentRegionId),
    };
  }, [locations, okmsList, currentRegionId]);

  const error = errorLocations || errorOkmsList;
  useNotificationAddErrorOnce(error);

  return {
    geographyGroups,
    currentRegion,
    isLoading,
    isError: !!errorLocations || !!errorOkmsList,
  };
};
