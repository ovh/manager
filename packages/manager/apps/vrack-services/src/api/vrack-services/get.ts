import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import {
  EligibleManagedService,
  VrackServicesWithIAM,
  Zone,
} from './vrack-services.type';
import { createFetchDataFn } from '../common';

export const getvrackServicesReferenceZoneListQueryKey = [
  'get/vrackServices/reference/zone',
];

/**
 * List all vRack Services zones
 */
export const getvrackServicesReferenceZoneList = createFetchDataFn<Zone[]>({
  url: '/vrackServices/reference/zone',
  method: 'get',
  apiVersion: 'v2',
});

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
  createFetchDataFn<VrackServicesWithIAM[]>({
    url: '/vrackServices/resource',
    method: 'get',
    apiVersion: 'v2',
    params: { headers: { 'X-Pagination-Cursor': cursor } },
  })();

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
  createFetchDataFn<VrackServicesWithIAM>({
    url: `/vrackServices/resource/${vrackServicesId}`,
    method: 'get',
    apiVersion: 'v2',
  })();

export const getEligibleManagedServiceListQueryKey = (
  vrackServicesId: string,
) => [`get/vrackServices/resource/${vrackServicesId}/eligibleManagedService`];

/**
 * List all managed services eligible to the requested vRack Services
 */
export const getEligibleManagedServiceList = async (vrackServicesId: string) =>
  createFetchDataFn<EligibleManagedService[]>({
    url: `/vrackServices/resource/${vrackServicesId}/eligibleManagedService`,
    method: 'get',
    apiVersion: 'v2',
  })();
