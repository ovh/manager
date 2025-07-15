import { useEffect, useMemo } from 'react';
import { Location } from '@secret-manager/types/location.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useLocations } from '@secret-manager/data/hooks/useLocation';
import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useOkmsList } from '@/data/hooks/useOkms';
import { findLocationByRegion } from '@/modules/secret-manager/utils/location';
import { OKMS } from '@/types/okms.type';

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
 * Builds a list of regions with an available domain
 * Locations are used to get the region name and geography label
 */
const buildRegionOptions = (
  locations: Location[],
  domains: OKMS[],
): RegionOption[] => {
  // Deduplicate regions
  const uniqueRegions = [...new Set(domains.map((domain) => domain.region))];

  return uniqueRegions
    .map((region) => {
      const location = findLocationByRegion(locations, region);
      if (!location) return null;

      const regionDomains = domains.filter(
        (domain) => domain.region === region,
      );

      return {
        label: location.location,
        region: location.name,
        geographyLabel: location.geographyName,
        href:
          // If only one domain is available, redirect to the secrets listing page
          regionDomains.length === 1
            ? SECRET_MANAGER_ROUTES_URLS.secretListing(regionDomains[0].id)
            : SECRET_MANAGER_ROUTES_URLS.secretDomains(region),
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
    data: domains,
    isPending: isPendingDomains,
    error: errorDomains,
  } = useOkmsList();
  const { addError } = useNotifications();
  const currentRegionId = useCurrentRegion(domains || []);

  const isLoading = isPendingLocations || isPendingDomains;

  const { geographyGroups, currentRegion } = useMemo(() => {
    if (!locations || !domains) {
      return { geographyGroups: [], currentRegion: undefined };
    }

    const regionOptions = buildRegionOptions(locations, domains);
    return {
      geographyGroups: groupRegionOptions(regionOptions),
      currentRegion: findCurrentRegionOption(regionOptions, currentRegionId),
    };
  }, [locations, domains, currentRegionId]);

  // Handle errors from locations and domains
  useEffect(() => {
    if (errorLocations) {
      addError(errorLocations?.response?.data?.message);
    }
    if (errorDomains) {
      addError(errorDomains?.response?.data?.message);
    }
  }, [errorLocations, errorDomains]);

  return {
    geographyGroups,
    currentRegion,
    isLoading,
    isError: !!errorLocations || !!errorDomains,
  };
};
