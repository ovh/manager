import { useMemo } from 'react';
import { Location } from '@secret-manager/types/location.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useLocations } from '@secret-manager/data/hooks/useLocation';
import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { useOkmsList } from '@/data/hooks/useOkms';
import { findLocationByRegion } from '@/modules/secret-manager/utils/location';
import { OKMS } from '@/types/okms.type';
import { useNotificationAddErrorOnce } from '@/hooks/useNotificationAddErrorOnce';

export type RegionOption = {
  label: string;
  region: string;
  geographyLabel: string;
  href: string;
};

export type GeographyGroup = {
  geographyLabel: string;
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
const buildRegionOptions = (
  locations: Location[],
  okmsList: OKMS[],
): RegionOption[] => {
  // Deduplicate regions
  const uniqueRegions = [...new Set(okmsList.map((okms) => okms.region))];

  return uniqueRegions
    .map((region) => {
      const location = findLocationByRegion(locations, region);
      if (!location) return null;

      const regionOkmsList = okmsList.filter((okms) => okms.region === region);

      return {
        label: location.location,
        region: location.name,
        geographyLabel: location.geographyName,
        href:
          // If only one okms is available, redirect to the secrets listing page
          regionOkmsList.length === 1
            ? SECRET_MANAGER_ROUTES_URLS.secretList(regionOkmsList[0].id)
            : SECRET_MANAGER_ROUTES_URLS.okmsList(region),
      };
    })
    .filter((option) => option !== null);
};

/**
 * Group regionsOptions by geographyLabel (e.g., "Europe", "North America")
 */
const groupRegionOptions = (
  regionOptions: RegionOption[],
): GeographyGroup[] => {
  return regionOptions.reduce<GeographyGroup[]>((acc, regionOption) => {
    const existingRegion = acc.find(
      (group) => group.geographyLabel === regionOption.geographyLabel,
    );

    if (existingRegion) {
      existingRegion.regions.push(regionOption);
    } else {
      acc.push({
        geographyLabel: regionOption.geographyLabel,
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
  const {
    data: locations,
    isPending: isPendingLocations,
    error: errorLocations,
  } = useLocations();
  const {
    data: okmsList,
    isPending: isPendingOkmsList,
    error: errorOkmsList,
  } = useOkmsList();

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
