import {
  UpdateVrackServicesParams,
  VrackServices,
} from './vrack-services.type';
import { createFetchDataFn } from '../common';

export const updateVrackServicesQueryKey = (vrackServicesId: string) => [
  'put/vrackServices/resource',
  vrackServicesId,
];

/**
 * Operations on vRack Services : Update the vRack Services configuration
 */
export const updateVrackServices = async ({
  vrackServicesId,
  checksum,
  targetSpec,
}: UpdateVrackServicesParams) =>
  createFetchDataFn<VrackServices>({
    url: `/vrackServices/resource/${vrackServicesId}`,
    method: 'put',
    apiVersion: 'v2',
    params: { checksum, targetSpec },
  })();
