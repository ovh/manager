import { TAddon } from '@ovh-ux/manager-pci-common';
import { v6 } from '@ovh-ux/manager-core-api';
import { TRegion } from '@/api/data/regions';

export type TCatalogGroup = {
  name: string;
  tags: string[];
};

export type TVolumePricing = Pick<TAddon['pricings'][number], 'price'> & {
  regions: TRegion['name'][];
  showAvailabilityZones: boolean;
  interval: 'day' | 'hour' | 'month' | 'none';
  specs: {
    name: string;
    bandwidth: {
      guaranteed: boolean;
      level: number;
      max: number;
      unit: string;
      unlimited: boolean;
    } | null;
    volume: {
      iops: {
        level: number;
        max: number;
        guaranteed: boolean;
        unit: string;
        maxUnit: string;
      };
      capacity: {
        max: number;
      };
    };
    maxAttachedInstances: number;
  };
  areIOPSDynamic: boolean;
};

export type TVolumeCatalogFilter = {
  [key in 'deployment' | 'region']: TCatalogGroup[];
};

export type TVolumeCatalogElementFilter = {
  [Property in keyof TVolumeCatalogFilter]?: TVolumeCatalogFilter[Property][number]['name'][];
};

export type TVolumeAddon = {
  name: string;
  tags: string[];
  filters: TVolumeCatalogElementFilter;
  pricings: TVolumePricing[];
};

export type TVolumeCatalog = {
  filters: TVolumeCatalogFilter;
  regions: TRegion[];
  models: TVolumeAddon[];
};

export const getVolumeCatalog = async (
  projectId: string,
): Promise<TVolumeCatalog> =>
  (await v6.get<TVolumeCatalog>(`/cloud/project/${projectId}/catalog/volume`))
    .data;
