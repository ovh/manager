import { ApiResponse, v2 } from '@ovh-ux/manager-core-api';

import { ApiRegion } from '@/types/Region.type';

export const GET_REGIONS_ROUTE = '/location';

export const getRegion = async (id: string): Promise<ApiResponse<ApiRegion>> =>
  v2.get(`${GET_REGIONS_ROUTE}/${id}`);
