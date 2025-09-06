import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

import { VrackServicesWithIAM } from '../../../types';

export const getVrackServicesResourceListQueryKey = ['get/vrackServices/resource'];

export type GetVrackServicesResourceListParams = {
  /** Pagination cursor */
  cursor?: 'next' | 'prev';
};

/**
 * Operations on vRack Services : List all vRack Services
 */
export const getVrackServicesResourceList = async ({
  cursor,
}: GetVrackServicesResourceListParams = {}): Promise<ApiResponse<VrackServicesWithIAM[]>> =>
  apiClient.v2.get<VrackServicesWithIAM[]>('/vrackServices/resource', {
    headers: {
      'X-Pagination-Cursor': cursor,
    },
  });
