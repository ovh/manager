import { apiClient } from '@ovh-ux/manager-core-api';
import { EligibleManagedService } from '../../../types';

export const getEligibleManagedServiceListQueryKey = (
  vrackServicesId: string,
) => [`get/vrackServices/resource/${vrackServicesId}/eligibleManagedService`];

/**
 * List all managed services eligible to the requested vRack Services
 */
export const getEligibleManagedServiceList = async (vrackServicesId: string) =>
  apiClient.v2.get<EligibleManagedService[]>(
    `/vrackServices/resource/${vrackServicesId}/eligibleManagedService`,
  );
