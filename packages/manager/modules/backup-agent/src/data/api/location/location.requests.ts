import apiClient from '@ovh-ux/manager-core-api';

import { Region } from '@/types/Location.type';

const getLocationRoute = (locationName: string) => `/location/${locationName}`;

export const getLocationDetails = async (locationName: string) =>
  (await apiClient.v2.get<Region>(getLocationRoute(locationName))).data;
