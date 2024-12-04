import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import {
  REGION_CAPACITY,
  S3_REGION_CAPACITY,
} from '../../components/rclone-download/constants';

export type TRegion = {
  name: string;
  type: string;
  status: string;
  continentCode: string;
  services: {
    name: string;
    status: string;
    endpoint: string;
  }[];
  datacenterLocation: string;
};

export const getProjectRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export const getS3StorageRegions = async (
  regions: TRegion[],
): Promise<TRegion[]> =>
  regions.filter(({ services }) =>
    services.find(({ name }) => S3_REGION_CAPACITY.includes(name)),
  );

export const getStorageRegions = async (
  regions: TRegion[],
): Promise<TRegion[]> =>
  regions.filter(({ services }) =>
    services.find(({ name }) => name === REGION_CAPACITY),
  );
