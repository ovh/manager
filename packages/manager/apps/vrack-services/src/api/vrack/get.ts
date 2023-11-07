import { queryClient } from '@ovh-ux/manager-react-core-application';
import { fetchIceberg } from '@ovh-ux/manager-core-api';
import {
  AllowedServicesResponse,
  AllowedService,
  EligibleServicesResponse,
  NonExpiringService,
  Task,
} from '../api.type';
import { VrackWithIAM } from './vrack.type';
import { VrackServices } from '../vrack-services';
import { createFetchDataFn } from '../common';

export const getVrackListQueryKey = ['get/vrack'];

/**
 * List available vrack
 */
export const getVrackList = async (): Promise<string[]> => {
  const fetchData = async () =>
    fetchIceberg<VrackWithIAM[]>({
      route: '/vrack',
      apiVersion: 'v6',
    });

  return queryClient.fetchQuery(getVrackListQueryKey, fetchData);
};

export type GetVrackServiceParams = {
  /** The internal name of your vrack */
  serviceName: string;
};

export const getVrackServiceQueryKey = ({
  serviceName,
}: GetVrackServiceParams) => [`get/vrack/${serviceName}`];

/**
 * vrack : Get this object properties
 */
export const getVrackService = async ({ serviceName }: GetVrackServiceParams) =>
  queryClient.fetchQuery(
    getVrackServiceQueryKey({ serviceName }),
    createFetchDataFn<VrackWithIAM>({
      url: `/vrack/${serviceName}`,
      apiVersion: 'v6',
      method: 'get',
    }),
  );

export type GetVrackServiceAllowedServicesParams = {
  /** Filter on a specific service family */
  serviceFamily: AllowedService;
  /** The internal name of your vrack */
  serviceName: string;
};

export const getVrackServiceAllowedServicesQueryKey = ({
  serviceName,
  serviceFamily,
}: GetVrackServiceAllowedServicesParams) => [
  `get/vrack/${serviceName}/allowedServices${serviceFamily || ''}`,
];

/**
 * allowedServices operations : List all services allowed in this vrack
 */
export const getVrackServiceAllowedServices = async ({
  serviceName,
  serviceFamily,
}: GetVrackServiceAllowedServicesParams) =>
  queryClient.fetchQuery(
    getVrackServiceAllowedServicesQueryKey({ serviceFamily, serviceName }),
    createFetchDataFn<AllowedServicesResponse>({
      url: `/vrack/${serviceName}/allowedServices${
        serviceFamily ? `?serviceFamily=${serviceFamily}` : ''
      }`,
      method: 'get',
      apiVersion: 'v6',
    }),
  );

export type GetVrackServiceEligibleServicesParams = {
  /** The internal name of your vrack */
  serviceName: string;
};

export const getVrackServiceEligibleServicesQueryKey = ({
  serviceName,
}: GetVrackServiceEligibleServicesParams) => [
  `get/vrack/${serviceName}/eligibleServices`,
];

/**
 * List all eligible services for this vRack asynchronously : List all eligible services for this vRack asynchronously
 */
export const getVrackServiceEligibleServices = async ({
  serviceName,
}: GetVrackServiceEligibleServicesParams) =>
  queryClient.fetchQuery(
    getVrackServiceEligibleServicesQueryKey({ serviceName }),
    createFetchDataFn<EligibleServicesResponse>({
      url: `/vrack/${serviceName}/eligibleServices`,
      method: 'get',
      apiVersion: 'v6',
    }),
  );

export type GetVrackServiceServiceInfosParams = {
  /** The internal name of your vrack */
  serviceName: string;
};

export const getVrackServiceServiceInfosQueryKey = ({
  serviceName,
}: GetVrackServiceServiceInfosParams) => [
  `get/vrack/${serviceName}/serviceInfos`,
];

/**
 * Details about a non-expiring Service : Get this object properties
 */
export const getVrackServiceServiceInfos = async ({
  serviceName,
}: GetVrackServiceServiceInfosParams) =>
  queryClient.fetchQuery(
    getVrackServiceServiceInfosQueryKey({ serviceName }),
    createFetchDataFn<NonExpiringService>({
      url: `/vrack/${serviceName}/serviceInfos`,
      method: 'get',
      apiVersion: 'v6',
    }),
  );

export type GetVrackServiceTaskListParams = {
  /** The internal name of your vrack */
  serviceName: string;
};

export const getVrackServiceTaskListQueryKey = ({
  serviceName,
}: GetVrackServiceTaskListParams) => [`get/vrack/${serviceName}/task`];

/**
 * List the vrack.Task objects : vrack tasks
 */
export const getVrackServiceTaskList = async ({
  serviceName,
}: GetVrackServiceTaskListParams) =>
  queryClient.fetchQuery(
    getVrackServiceTaskListQueryKey({ serviceName }),
    createFetchDataFn<number[]>({
      url: `/vrack/${serviceName}/task`,
      method: 'get',
      apiVersion: 'v6',
    }),
  );

export type GetVrackServiceTaskTaskIdParams = {
  /** The internal name of your vrack */
  serviceName: string;
  taskId: number;
};

export const getVrackServiceTaskTaskIdQueryKey = ({
  serviceName,
  taskId,
}: GetVrackServiceTaskTaskIdParams) => [
  `get/vrack/${serviceName}/task/${taskId}`,
];

/**
 * vrack tasks : Get this object properties
 */
export const getVrackServiceTaskTaskId = async ({
  serviceName,
  taskId,
}: GetVrackServiceTaskTaskIdParams) =>
  queryClient.fetchQuery(
    getVrackServiceTaskTaskIdQueryKey({ serviceName, taskId }),
    createFetchDataFn<Task>({
      url: `/vrack/${serviceName}/task/${taskId}`,
      method: 'get',
      apiVersion: 'v6',
    }),
  );

export type GetVrackServiceVrackServicesListParams = {
  /** The internal name of your vrack */
  serviceName: string;
};

export const getVrackServiceVrackServicesListQueryKey = ({
  serviceName,
}: GetVrackServiceVrackServicesListParams) => [
  `get/vrack/${serviceName}/vrackServices`,
];

/**
 * List the vrack.vrackServices objects : vrack for vrackServices
 */
export const getVrackServiceVrackServicesList = async ({
  serviceName,
}: GetVrackServiceVrackServicesListParams) =>
  queryClient.fetchQuery(
    getVrackServiceVrackServicesListQueryKey({ serviceName }),
    createFetchDataFn<string[]>({
      url: `/vrack/${serviceName}/vrackServices`,
      method: 'get',
      apiVersion: 'v6',
    }),
  );

export type GetVrackServiceVrackServicesVrackServicesParams = {
  /** The internal name of your vrack */
  serviceName: string;
  /** vrackServices service name */
  vrackServices: string;
};

export const getVrackServiceVrackServicesVrackServicesQueryKey = ({
  serviceName,
  vrackServices,
}: GetVrackServiceVrackServicesVrackServicesParams) => [
  `get/vrack/${serviceName}/vrackServices/${vrackServices}`,
];

/**
 * vrackServices in vrack : Get this object properties
 */
export const getVrackServiceVrackServicesVrackServices = async ({
  serviceName,
  vrackServices,
}: GetVrackServiceVrackServicesVrackServicesParams) =>
  queryClient.fetchQuery(
    getVrackServiceVrackServicesVrackServicesQueryKey({
      serviceName,
      vrackServices,
    }),
    createFetchDataFn<VrackServices>({
      url: `/vrack/${serviceName}/vrackServices/${vrackServices}`,
      method: 'get',
      apiVersion: 'v6',
    }),
  );
