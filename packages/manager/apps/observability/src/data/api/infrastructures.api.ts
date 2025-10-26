import apiClient from '@ovh-ux/manager-core-api';
import { Location } from '@ovh-ux/shell';

export const getLocations = async (signal: AbortSignal): Promise<Location[]> => {
  const { data } = await apiClient.v2.get<Location[]>(`location`, {
    signal,
  });
  return data;
};
