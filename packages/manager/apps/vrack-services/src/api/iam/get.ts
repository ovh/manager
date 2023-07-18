import { createFetchDataFn } from '../common';
import { IAMResource } from './iam.type';

export const getIamResourceQueryKey = (resourceURNList: string[]) => [
  `get/iam/resource/${resourceURNList.join(',')}`,
];

/**
 * Get the vRack Services
 */
export const getIamResource = async (resourceURNList: string[]) =>
  createFetchDataFn<IAMResource[]>({
    url: `/iam/resource?resourceURN=${resourceURNList.join(',')}`,
    method: 'get',
    apiVersion: 'v2',
  })();
