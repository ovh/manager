import { ApiResponse, v2 } from '@ovh-ux/manager-core-api';

import { TLocation } from '@/types/Location.type';

export const GET_LOCATIONS_ROUTE = '/location';

export const getLocationDetails = async (name: string): Promise<ApiResponse<TLocation>> =>
  v2.get(`${GET_LOCATIONS_ROUTE}/${name}`);
