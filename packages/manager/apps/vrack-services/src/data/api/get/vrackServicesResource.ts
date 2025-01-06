import { apiClient } from '@ovh-ux/manager-core-api';
import { VrackServicesWithIAM } from '@/types';

export const getVrackServicesResourceQueryKey = (vrackServicesId: string) => [
  `get/vrackServices/resource/${vrackServicesId}`,
];

/**
 * Get the vRack Services
 */
export const getVrackServicesResource = async (vrackServicesId: string) =>
  apiClient.v2.get<VrackServicesWithIAM>(
    `/vrackServices/resource/${vrackServicesId}`,
  );
