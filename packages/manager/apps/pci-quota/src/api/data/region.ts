import { v6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  name: string;
};

export type TAddRegionResponse = {
  continentCode: string;
  countryCode: string;
  name: string;
  status: string;
  type: string;
};

export const getAvailableRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const url = `/cloud/project/${projectId}/regionAvailable`;
  const { data } = await v6.get<TRegion[]>(url, {
    headers: {
      'X-Pagination-Mode': 'CachedObjectList-Pages',
    },
  });

  return data;
};

export const addRegion = async (
  projectId: string,
  regionCode: string,
): Promise<TAddRegionResponse> => {
  const url = `/cloud/project/${projectId}/region`;
  const { data } = await v6.post<TAddRegionResponse>(url, {
    region: regionCode,
  });
  return data;
};
