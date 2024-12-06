import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import {
  REGION_CAPACITY,
  S3_REGION_CAPACITY,
} from '@/download-rclone.constants';
import { ALPHA_CHARACTERS_REGEX } from '@/constants';

export type Region = {
  name: string;
  type: string;
  status: string;
  ipCountries: string[];
  continentCode: string;
  datacenterLocation: string;
  services: RegionService[];
};

export type RegionService = {
  name: string;
  status: string;
  endpoint: string;
};

export const getAllRegions = async (projectId: string): Promise<Region[]> => {
  const { data } = await fetchIcebergV6<Region>({
    route: `/cloud/project/${projectId}/region`,
  });

  return data;
};

export const getS3StorageRegions = async (
  regions: Region[],
): Promise<Region[]> => {
  return regions.filter(({ services }) => {
    return services.find(({ name }) => S3_REGION_CAPACITY.includes(name));
  });
};

export const getStorageRegions = async (
  regions: Region[],
): Promise<Region[]> => {
  return regions.filter(({ services }) => {
    return services.find(({ name }) => name === REGION_CAPACITY);
  });
};

export const getOpenRcApiVersion = (regions: Region[], region: string) => {
  const hasGlobalRegions = regions.some((r) =>
    ALPHA_CHARACTERS_REGEX.test(r.name),
  );
  // Returns v3 if the region list has global regions i.e, GRA, DE, etc
  return hasGlobalRegions || region === 'US' ? 3 : 2;
};
