import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { TRegion, TRegionType } from '@ovh-ux/manager-pci-common';

export type TRegionBase = {
  name: string;
  type: TRegionType;
  availabilityZones: string[];
  continentCode: 'ASIA' | 'EU' | 'NA' | 'US' | string;
};

export type TRegionPOST = { region: string };

export const getProjectRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const { data } = await fetchIcebergV6<TRegion>({
    route: `/cloud/project/${projectId}/region`,
  });
  return data;
};

export const addProjectRegion = async (
  projectId: string,
  region: string,
): Promise<TRegionPOST> => {
  const { data } = await v6.post<TRegionPOST>(
    `/cloud/project/${projectId}/region`,
    {
      region,
    },
  );
  return data;
};
