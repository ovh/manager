import { TAddon } from '@ovh-ux/manager-pci-common';
import { v6 } from '@ovh-ux/manager-core-api';

export type TPricing = {
  capacities: string[];
  mode: string;
  phase: number;
  commitment: number;
  description: string;
  price: {
    currencyCode: string;
    text: string;
    value: number;
  };
  tax: number;
  interval: number;
  intervalUnit: string;
  quantity: {
    max?: number;
    min?: number;
  };
  repeat: {
    max?: number;
    min?: number;
  };
  strategy: string;
  mustBeCompleted: boolean;
  type: string;
  promotions: unknown[];
  engagementConfiguration?: unknown;
};

export type TRegionGroup = {
  name: string;
  tags: string[];
};

export type TModelGroup = {
  name: string;
  type: string;
  tags: string[];
};

export type TRegion = {
  name: string;
  type: '3-az' | 'region' | 'localzone';
  availabilityZone: string[];
  isInMaintenance: boolean;
  isUp: boolean;
  isActivated: boolean;
  country: string;
  regionGroup: string;
  datacenter: string;
};

export type TVolumePricing = Omit<
  TAddon['pricings'][number],
  'interval' | 'intervalUnit'
> & {
  regions: TRegion['name'][];
  interval: 'day' | 'hour' | 'month' | 'none';
};

export type TVolumeAddon = Omit<TAddon, 'pricings'> & {
  groups: TRegionGroup['name'][];
  pricings: TVolumePricing[];
  pricingType: 'consumption' | string;
};

export type TVolumeCatalog = {
  modelsGroups: TModelGroup[];
  regionsGroups: TRegionGroup[];
  regions: TRegion[];
  models: TVolumeAddon[];
};

export const getVolumeCatalog = async (
  projectId: string,
): Promise<TVolumeCatalog> =>
  (await v6.get<TVolumeCatalog>(`/cloud/project/${projectId}/catalog/volume`))
    .data;

export function getLeastPrice(pricings: TVolumePricing[]) {
  return pricings.reduce<number | null>(
    (leastPrice, p) =>
      leastPrice === null ? p.price : Math.min(p.price, leastPrice),
    null,
  );
}

function isConsumptionAddon(
  addon: TVolumeAddon,
): addon is TVolumeAddon & { pricingType: 'consumption' } {
  return addon.pricingType === 'consumption';
}

function isConsumptionPricing(p: TVolumePricing) {
  return p.capacities.includes('consumption');
}

export function mapPricesToGroups(
  groups: TRegionGroup[],
  regions: TRegion[],
  models: TVolumeAddon[],
): (TRegionGroup & { leastPrice: number })[] {
  return groups.map((group) => {
    const groupRegions = regions
      .filter((r) => r.type === group.name)
      .map((r) => r.name);

    const hasGroupRegions = (p: TVolumePricing) =>
      p.regions.some((r) => groupRegions.includes(r));

    return {
      ...group,
      leastPrice: models
        .filter(isConsumptionAddon)
        .map((m) =>
          getLeastPrice(
            m.pricings.filter(isConsumptionPricing).filter(hasGroupRegions),
          ),
        )
        .reduce<number | null>(
          (leastPrice, modelLeastPrice) =>
            leastPrice === null
              ? modelLeastPrice
              : Math.min(modelLeastPrice, leastPrice),
          null,
        ),
    };
  });
}
