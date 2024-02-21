import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import {
  REGION_CAPACITY,
  S3_REGION_CAPACITY,
} from '@/download-rclone.constants';

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

export type DownloadRCloneConfigResult = {
  content: string;
};

export const downloadRCloneConfig = async (
  projectId: string,
  userId: string,
  region: string,
  service: string,
): Promise<DownloadRCloneConfigResult> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/user/${userId}/rclone?region=${region}&service=${service}`,
  );
  return data;
};
