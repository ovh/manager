import { v6 } from '@ovh-ux/manager-core-api';

export type TInactiveRegion = {
  continentCode: string;
  datacenterLocation: string;
  name: string;
  type: string;
};

export const getInactiveRegionsUrl = (projectId: string) =>
  `/cloud/project/${projectId}/regionAvailable`;

export const getInactiveRegions = async (
  projectId: string,
): Promise<TInactiveRegion[]> => {
  const { data } = await v6.get<TInactiveRegion[]>(
    getInactiveRegionsUrl(projectId),
  );
  return data;
};
