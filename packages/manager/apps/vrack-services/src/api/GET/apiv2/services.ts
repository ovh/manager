import { queryClient } from '@ovh-ux/manager-react-core-application';
import { fetchIceberg } from '@ovh-ux/manager-core-api';
import {
  EligibleManagedService,
  Event,
  Task,
  VrackServicesWithIAM,
  Zone,
} from '../../api.type';
import { createFetchDataFn } from '../../common';

export const getvrackServicesReferenceCompatibleProductListQueryKey = [
  'get/vrackServices/reference/compatibleProduct',
];

/**
 * List all products that are compatible with vRack Services
 */
export const getvrackServicesReferenceCompatibleProductList = async () =>
  queryClient.fetchQuery(
    getvrackServicesReferenceCompatibleProductListQueryKey,
    createFetchDataFn<string[]>({
      url: '/vrackServices/reference/compatibleProduct',
      method: 'get',
      apiVersion: 'v2',
    }),
  );

export const getvrackServicesReferenceEventKindListQueryKey = [
  'get/vrackServices/reference/event/kind',
];

/**
 * List all kind of event
 */
export const getvrackServicesReferenceEventKindList = async () =>
  queryClient.fetchQuery(
    getvrackServicesReferenceEventKindListQueryKey,
    createFetchDataFn<string[]>({
      url: '/vrackServices/reference/event/kind',
      method: 'get',
      apiVersion: 'v2',
    }),
  );

export const getvrackServicesReferenceEventTypeListQueryKey = [
  'get/vrackServices/reference/event/type',
];

/**
 * List all type of event
 */
export const getvrackServicesReferenceEventTypeList = async () =>
  queryClient.fetchQuery(
    getvrackServicesReferenceEventTypeListQueryKey,
    createFetchDataFn<string[]>({
      url: '/vrackServices/reference/event/type',
      method: 'get',
      apiVersion: 'v2',
    }),
  );

export const getvrackServicesReferenceZoneListQueryKey = [
  'get/vrackServices/reference/zone',
];

/**
 * List all vRack Services zones
 */
export const getvrackServicesReferenceZoneList = async () =>
  queryClient.fetchQuery(
    getvrackServicesReferenceZoneListQueryKey,
    createFetchDataFn<Zone[]>({
      url: '/vrackServices/reference/zone',
      method: 'get',
      apiVersion: 'v2',
    }),
  );

export type GetvrackServicesResourceListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': string;
};

export const getvrackServicesResourceListQueryKey = [
  'get/vrackServices/resource',
];

/**
 * Operations on vRack Services : List all vRack Services
 */
export const getvrackServicesResourceList = async (
  params: GetvrackServicesResourceListParams,
) =>
  queryClient.fetchQuery(
    getvrackServicesResourceListQueryKey,
    createFetchDataFn<VrackServicesWithIAM[]>({
      url: '/vrackServices/resource',
      method: 'get',
      apiVersion: 'v2',
      params,
    }),
  );

export const getListingIcebergQueryKey = ['servicesListingIceberg'];

/**
 * Get listing with iceberg
 */
export const getListingIceberg = async () => {
  const fetchData = async () =>
    fetchIceberg<VrackServicesWithIAM>({
      route: '/vrackServices/resource',
      apiVersion: 'v2',
    });

  return queryClient.fetchQuery(getListingIcebergQueryKey, fetchData);
};

export type GetvrackServicesResourceVrackServicesIdParams = {
  /** Vrack services ID */
  vrackServicesId: string;
};

export const getvrackServicesResourceVrackServicesIdQueryKey = ({
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdParams) => [
  `get/vrackServices/resource/${vrackServicesId}`,
];

/**
 * Get the vRack Services
 */
export const getvrackServicesResourceVrackServicesId = async ({
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdParams) =>
  queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdQueryKey({ vrackServicesId }),
    createFetchDataFn<VrackServicesWithIAM>({
      url: `/vrackServices/resource/${vrackServicesId}`,
      method: 'get',
      apiVersion: 'v2',
    }),
  );

export type GetvrackServicesResourceVrackServicesIdEligibleManagedServiceListParams = {
  /** Vrack services ID */
  vrackServicesId: string;
};

export const getvrackServicesResourceVrackServicesIdEligibleManagedServiceListQueryKey = ({
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdEligibleManagedServiceListParams) => [
  `get/vrackServices/resource/${vrackServicesId}/eligibleManagedService`,
];

/**
 * List all managed services eligible to the requested vRack Services
 */
export const getvrackServicesResourceVrackServicesIdEligibleManagedServiceList = async ({
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdEligibleManagedServiceListParams) =>
  queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdEligibleManagedServiceListQueryKey({
      vrackServicesId,
    }),
    createFetchDataFn<EligibleManagedService[]>({
      url: `/vrackServices/resource/${vrackServicesId}/eligibleManagedService`,
      method: 'get',
      apiVersion: 'v2',
    }),
  );

export type GetvrackServicesResourceVrackServicesIdEventListParams = {
  /** Vrack services ID */
  vrackServicesId: string;
};

export const getvrackServicesResourceVrackServicesIdEventListQueryKey = ({
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdEventListParams) => [
  `get/vrackServices/resource/${vrackServicesId}/event`,
];

/**
 * vRack Services actions history : List all events that happened on the vRack Services
 */
export const getvrackServicesResourceVrackServicesIdEventList = async ({
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdEventListParams) =>
  queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdEventListQueryKey({
      vrackServicesId,
    }),
    createFetchDataFn<Event[]>({
      url: `/vrackServices/resource/${vrackServicesId}/event`,
      method: 'get',
      apiVersion: 'v2',
    }),
  );

export type GetvrackServicesResourceVrackServicesIdTaskListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': string;
  /** Vrack services ID */
  vrackServicesId: string;
};

export const getvrackServicesResourceVrackServicesIdTaskListQueryKey = ({
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdTaskListParams) => [
  `get/vrackServices/resource/${vrackServicesId}/task`,
];

/**
 * vRack Services tasks : List all asynchronous operations related to the vRack Services
 */
export const getvrackServicesResourceVrackServicesIdTaskList = async (
  data: GetvrackServicesResourceVrackServicesIdTaskListParams,
) =>
  queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdTaskListQueryKey(data),
    createFetchDataFn<Task[]>({
      url: `/vrackServices/resource/${data.vrackServicesId}/task`,
      method: 'get',
      apiVersion: 'v2',
      params: { data },
    }),
  );

export type GetvrackServicesResourceVrackServicesIdTaskTaskIdParams = {
  /** Task ID */
  taskId: string;
  /** Vrack services ID */
  vrackServicesId: string;
};

export const getvrackServicesResourceVrackServicesIdTaskTaskIdQueryKey = ({
  taskId,
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdTaskTaskIdParams) => [
  `get/vrackServices/resource/${vrackServicesId}/task/${taskId}`,
];

/**
 * vRack Services tasks : Get the task
 */
export const getvrackServicesResourceVrackServicesIdTaskTaskId = async ({
  taskId,
  vrackServicesId,
}: GetvrackServicesResourceVrackServicesIdTaskTaskIdParams) =>
  queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdTaskTaskIdQueryKey({
      taskId,
      vrackServicesId,
    }),
    createFetchDataFn<Task>({
      url: `/vrackServices/resource/${vrackServicesId}/task/${taskId}`,
      method: 'get',
      apiVersion: 'v2',
    }),
  );
