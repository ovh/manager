import { v6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  continentCode: string;
  datacenterLocation: string;
  ipCountries: unknown[];
  name: string;
  services: { name: string; status: 'UP'; endpoint: string }[];
  status: 'UP';
  type: 'region' | 'localzone' | 'region-3-az';
};

export const getRegion = async (
  projectId: string,
  region: string,
): Promise<TRegion> => {
  const { data } = await v6.get<TRegion>(
    `/cloud/project/${projectId}/region/${region}`,
  );

  return data;
};
