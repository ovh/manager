import { useMemo } from 'react';
import { Location } from '@secret-manager/types/location.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { useLocations } from '@/common/data/hooks/useLocation';
import { useOkmsList } from '@/data/hooks/useOkms';
import { findLocationByRegion } from '@/modules/secret-manager/utils/location';
import { OKMS } from '@/types/okms.type';
import { useNotificationAddErrorOnce } from '@/hooks/useNotificationAddErrorOnce';
import { useOrderCatalogOkms } from '@/data/hooks/useOrderCatalogOkms';

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
const buildRegionOptions = (locations: Location[]): RegionOption[] => {
  // Deduplicate regions

  return locations.map((location) => {
    return {
      label: location.location,
      region: location.name,
      geographyLabel: location.geographyName,
      href: SECRET_MANAGER_ROUTES_URLS.secretList(location.name),
    };
  });
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

export const useAllRegionSelector = (): UseRegionSelectorReturn => {
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

    const regionOptions = buildRegionOptions(locations);
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
