import { apiClient } from '@ovh-ux/manager-core-api';
import { Region } from '../../types';

export const getvrackServicesReferenceRegionListQueryKey = [
  'get/vrackServices/reference/region',
];

/**
 * List all vRack Services regions
 */
export const getvrackServicesReferenceRegionList = () =>
  apiClient.v2.get<Region[]>('/vrackServices/reference/region');
