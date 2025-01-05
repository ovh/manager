import { v6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  name: string;
};

export const getRegions = async (
  projectId: string,
  onlyAvailable = false,
): Promise<TRegion[]> => {
  const url = !onlyAvailable
    ? `/cloud/project/${projectId}/region`
    : `/cloud/project/${projectId}/regionAvailable`;
  const { data } = await v6.get<TRegion[]>(url, {
    headers: {
      'X-Pagination-Mode': 'CachedObjectList-Pages',
    },
  });

  return data;
};

export const addRegion = async (projectId: string, regionCode: string) => {
  const url = `/cloud/project/region?serviceName=${projectId}`;
  await v6.post(url, { region: regionCode });
};
