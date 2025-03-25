import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type TRegionType = 'region' | 'localzone' | 'region-3-az' | string;

export type TRegionBase = {
  name: string;
  type: TRegionType;
  availabilityZones: string[];
  continentCode: 'ASIA' | 'EU' | 'NA' | 'US' | string;
};

export type TRegion = TRegionBase & {
  status: string;
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
