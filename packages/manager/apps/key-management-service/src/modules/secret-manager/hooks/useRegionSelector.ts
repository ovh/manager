import { useEffect, useMemo } from 'react';
import { Location } from '@secret-manager/types/location.type';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useLocations } from '@secret-manager/data/hooks/useLocation';
import { useCurrentRegion } from '@secret-manager/hooks/useCurrentRegion';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useOkmsList } from '@/data/hooks/useOkms';
import { findLocationByRegion } from '@/modules/secret-manager/utils/location';
import { OKMS } from '@/types/okms.type';

type RegionOption = {
  label: string;
  region: string;
  geographyLabel: string;
  href: string;
};

type GeographyGroup = {
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
 * Builds region options from locations and domains.
 */
const buildRegionOptions = (
  locations: Location[],
  domains: OKMS[],
): RegionOption[] => {
  const alreadyProcessedRegions = new Set<string>();

  return domains
    .map((domain) => {
      const { region } = domain;

      // Do not process the same region multiple times
      if (alreadyProcessedRegions.has(region)) {
        return null;
      }
      alreadyProcessedRegions.add(region);

      const location = findLocationByRegion(locations, region);
      if (!location) {
        return null;
      }

      return {
        label: location.location,
        region: location.name,
        geographyLabel: location.geographyName,
        href: SECRET_MANAGER_ROUTES_URLS.secretDomains(region),
      };
    })
    .filter(Boolean);
};

/**
 * Group regionsOptions by geographyLabel (e.g., "Europe", "North America")
 */
const groupRegionOptions = (
  regionOptions: RegionOption[],
): GeographyGroup[] => {
  return regionOptions.reduce((acc, link) => {
    const existingRegion = acc.find(
      (region) => region.geographyLabel === link.geographyLabel,
    );

    if (existingRegion) {
      existingRegion.regions.push(link);
    } else {
      acc.push({
        geographyLabel: link.geographyLabel,
        regions: [link],
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
  const currentRegionId = useCurrentRegion(domains);

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
  }, [locations, domains]);

  // Handle errors from locations and domains
  useEffect(() => {
    if (errorLocations) {
      addError(errorLocations.response.data.message);
    }
    if (errorDomains) {
      addError(errorDomains.response.data.message);
    }
  }, [errorLocations, errorDomains]);

  return {
    geographyGroups,
    currentRegion,
    isLoading,
    isError: !!errorLocations || !!errorDomains,
  };
};
