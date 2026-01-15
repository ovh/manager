import { v2 } from '@ovh-ux/manager-core-api';

import { Region } from '@/types/Location.type';

const getLocationRoute = (locationName: string) => `/location/${locationName}`;

export const getLocationDetails = async (locationName: string) =>
  (await v2.get<Region>(getLocationRoute(locationName))).data;
