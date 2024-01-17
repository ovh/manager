import { apiClient } from '@ovh-ux/manager-core-api';
import { IAMResource } from './iam.type';

export const getIamResourceQueryKey = (resourceURNList: string[]) => [
  `get/iam/resource/${resourceURNList.join(',')}`,
];

/**
 * Get the vRack Services
 */
export const getIamResource = async (resourceURNList: string[]) =>
  apiClient.v2.get<IAMResource[]>(
    `/iam/resource?resourceURN=${resourceURNList.join(',')}`,
  );
