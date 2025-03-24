import { apiClient } from '@ovh-ux/manager-core-api';
import {
  GetVrackServicesResourceListParams,
  VrackServicesWithIAM,
} from '../../types';

export const getVrackServicesResourceListQueryKey = [
  'get/vrackServices/resource',
];

/**
 * Operations on vRack Services : List all vRack Services
 */
export const getVrackServicesResourceList = async ({
  cursor,
}: GetVrackServicesResourceListParams = {}) =>
  apiClient.v2.get<VrackServicesWithIAM[]>('/vrackServices/resource', {
    headers: {
      'X-Pagination-Cursor': cursor,
    },
  });
