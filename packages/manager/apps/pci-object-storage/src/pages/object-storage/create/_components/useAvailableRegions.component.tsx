import { AvailabilityRegion } from '@datatr-ux/ovhcloud-types/cloud/capabilities/index';
import { Region } from '@datatr-ux/ovhcloud-types/cloud/index';
import { useMemo } from 'react';
import { ProductAvailability } from '@/types/Availability';

interface UseAvailableRegionsProps {
  regions: Region[];
  availabilities: ProductAvailability;
  options?: {
    filterDisabledRegions: boolean;
    filterServiceName: string | null;
  };
}
export function useAvailableRegions({
  regions,
  availabilities,
  options = {
    filterDisabledRegions: true,
    filterServiceName: null,
  },
}: UseAvailableRegionsProps) {
  const availableRegions: Region[] = useMemo(() => {
    // 1. Gather all regions from plans that start with "storage"
    const allRegions: AvailabilityRegion[] = availabilities.plans
      .filter(({ code }) => code.startsWith('storage'))
      .flatMap(({ regions: r }) => r);

    // 2. Deduplicate by region name
    const uniqueRegions = Array.from(
      new Map(allRegions.map((region) => [region.name, region])).values(),
    );

    // 3. Apply filtering rules
    const filteredRegions = uniqueRegions.filter((region) => {
      // Do not display non-enabled regions for s3 offer
      if (options.filterDisabledRegions && !region.enabled) {
        return false;
      }

      // For other offers, only display regions which have the current offer as service
      if (options.filterServiceName) {
        const projectRegion = regions?.find((pr) => pr.name === region.name);
        if (
          projectRegion &&
          !projectRegion.services.some(
            (service) => service.name === options.filterServiceName,
          )
        ) {
          return false;
        }
      }

      return true;
    });

    // 4. Return only regions that exist in `regions` prop
    return regions.filter((r) =>
      filteredRegions.some((fr) => fr.name === r.name),
    );
  }, [options, availabilities.plans, regions]);
  return availableRegions;
}
