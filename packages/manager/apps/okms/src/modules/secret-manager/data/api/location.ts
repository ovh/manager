import apiClient from '@ovh-ux/manager-core-api';
import { Location } from '@secret-manager/types/location.type';

export const locationQueryKeys = {
  list: ['location'],
};

export const getLocations = async (): Promise<Location[]> => {
  const { data } = await apiClient.v2.get<Location[]>(`location`);
  return data;
};
