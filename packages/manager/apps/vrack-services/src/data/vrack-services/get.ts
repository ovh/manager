import { apiClient, fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import {
  EligibleManagedService,
  VrackServicesWithIAM,
  Region,
} from './vrack-services.type';

export const getvrackServicesReferenceRegionListQueryKey = [
  'get/vrackServices/reference/region',
];

/**
 * List all vRack Services regions
 */
export const getvrackServicesReferenceRegionList = () =>
  apiClient.v2.get<Region[]>('/vrackServices/reference/region');

export type GetVrackServicesResourceListParams = {
  /** Pagination cursor */
  cursor?: 'next' | 'prev';
};

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

export const getListingIcebergQueryKey = ['servicesListingIceberg'];

export const getListingIceberg = async () =>
  fetchIcebergV2<VrackServicesWithIAM>({
    route: '/vrackServices/resource',
  });

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
