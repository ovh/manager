import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { Region } from '../../../types';

export const getVrackServicesRegionListQueryKey = [
  'get/vrackServices/reference/region',
];

/**
 * List all vRack Services regions
 */
export const getVrackServicesRegionList = (): Promise<ApiResponse<Region[]>> =>
  apiClient.v2.get<Region[]>('/vrackServices/reference/region');
