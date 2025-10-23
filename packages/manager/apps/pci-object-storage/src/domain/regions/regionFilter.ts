import { TRegionAvailability } from '@ovh-ux/manager-pci-common';
import { OBJECT_CONTAINER_OFFER_STORAGE_STANDARD } from '@/constants';

export interface RegionFilterCriteria {
  offer?: string;
  deploymentMode?: string;
  excludeRegion?: string;
  onlyEnabled?: boolean;
  removeMacroIfMicroAvailable?: boolean;
}

export interface RegionService {
  name: string;
}

export interface ProjectRegion {
  name: string;
  services: RegionService[];
}

export interface ProductAvailability {
  plans?: Array<{
    code: string;
    regions: TRegionAvailability[];
  }>;
}

export function filterAllowedRegions(
  availability: ProductAvailability | null,
  projectRegions: ProjectRegion[] | null,
  criteria: RegionFilterCriteria = {},
): TRegionAvailability[] {
  const {
    offer = OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
    deploymentMode = 'region',
    excludeRegion,
    removeMacroIfMicroAvailable = true,
  } = criteria;

  if (!availability?.plans) return [];

  const allRegions = availability.plans
    .filter(({ code }) => code.startsWith('storage'))
    .flatMap(({ regions }) => regions);

  const uniqueRegionsMap = new Map<string, TRegionAvailability>();
  allRegions.forEach((region) => {
    if (!uniqueRegionsMap.has(region.name)) {
      uniqueRegionsMap.set(region.name, region);
    }
  });

  const uniqueRegions = Array.from(uniqueRegionsMap.values());
  let filteredRegions = uniqueRegions.filter((region) => {
    const isSwiftOffer = offer !== OBJECT_CONTAINER_OFFER_STORAGE_STANDARD;

    if (isSwiftOffer && !region.enabled) return false;
    if (region.type !== deploymentMode) return false;

    if (offer === OBJECT_CONTAINER_OFFER_STORAGE_STANDARD) return true;

    const projectRegion = projectRegions?.find((pr) => pr.name === region.name);
    return (
      !projectRegion ||
      projectRegion.services.some(
        ({ name: serviceName }) => serviceName === offer,
      )
    );
  });

  if (removeMacroIfMicroAvailable) {
    const datacenterGroups = new Map<string, number>();
    filteredRegions.forEach(({ datacenter }) => {
      datacenterGroups.set(
        datacenter,
        (datacenterGroups.get(datacenter) || 0) + 1,
      );
    });

    filteredRegions = filteredRegions.filter(
      ({ name, datacenter }) =>
        name !== datacenter || datacenterGroups.get(datacenter) === 1,
    );
  }

  if (excludeRegion) {
    filteredRegions = filteredRegions.filter(
      (region) => region.name !== excludeRegion,
    );
  }

  console.log({ filteredRegions });
  return filteredRegions;
}

export function groupRegionsByContinent<T extends { name: string }>(
  regions: T[],
  getContinentName: (region: T) => string,
): Record<string, T[]> {
  return regions.reduce((acc, region) => {
    const continentName = getContinentName(region);
    if (!acc[continentName]) {
      acc[continentName] = [];
    }
    acc[continentName].push(region);
    return acc;
  }, {} as Record<string, T[]>);
}
