import { apiClient } from '@ovh-ux/manager-core-api';
import {
  UpdateVrackServicesParams,
  VrackServices,
} from './vrack-services.type';

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
  apiClient.v2.put<VrackServices>(
    `/vrackServices/resource/${vrackServicesId}`,
    { checksum, targetSpec },
  );
