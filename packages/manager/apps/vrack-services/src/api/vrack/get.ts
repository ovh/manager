import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import {
  AllowedServicesResponse,
  AllowedService,
  EligibleServicesResponse,
  NonExpiringService,
} from '../api.type';
import { createFetchDataFn } from '../common';

export const getVrackListQueryKey = ['get/vrack'];

export const getVrackList = () =>
  fetchIcebergV6<string>({
    route: '/vrack',
  });

export type GetVrackAllowedServicesParams = {
  /** Filter on a specific service family */
  serviceFamily: AllowedService;
  /** The internal name of your vrack */
  vrack: string;
};

export const getVrackAllowedServicesQueryKey = ({
  vrack,
  serviceFamily,
}: GetVrackAllowedServicesParams) => [
  `get/vrack/${vrack}/allowedServices${serviceFamily || ''}`,
];

/**
 * allowedServices operations : List all services allowed in this vrack
 */
export const getVrackAllowedServices = async ({
  vrack,
  serviceFamily,
}: GetVrackAllowedServicesParams) =>
  createFetchDataFn<AllowedServicesResponse>({
    url: `/vrack/${vrack}/allowedServices${
      serviceFamily ? `?serviceFamily=${serviceFamily}` : ''
    }`,
    method: 'get',
    apiVersion: 'v6',
  })();

export type GetVrackEligibleServicesParams = {
  /** The internal name of your vrack */
  vrack: string;
};

export const getVrackEligibleServicesQueryKey = ({
  vrack,
}: GetVrackEligibleServicesParams) => [`get/vrack/${vrack}/eligibleServices`];

/**
 * List all eligible services for this vRack asynchronously : List all eligible services for this vRack asynchronously
 */
export const getVrackServiceEligibleServices = async ({
  vrack,
}: GetVrackEligibleServicesParams) =>
  createFetchDataFn<EligibleServicesResponse>({
    url: `/vrack/${vrack}/eligibleServices`,
    method: 'get',
    apiVersion: 'v6',
  })();

export type GetVrackServiceInfosParams = {
  /** The internal name of your vrack */
  vrack: string;
};

export const getVrackServiceInfosQueryKey = ({
  vrack,
}: GetVrackServiceInfosParams) => [`get/vrack/${vrack}/serviceInfos`];

/**
 * Details about a non-expiring Service : Get this object properties
 */
export const getVrackServiceInfos = async ({
  vrack,
}: GetVrackServiceInfosParams) =>
  createFetchDataFn<NonExpiringService>({
    url: `/vrack/${vrack}/serviceInfos`,
    method: 'get',
    apiVersion: 'v6',
  })();

export type GetVrackVrackServicesListParams = {
  /** The internal name of your vrack */
  vrack: string;
};

export const getVrackVrackServicesListQueryKey = ({
  vrack,
}: GetVrackVrackServicesListParams) => [`get/vrack/${vrack}/vrackServices`];

/**
 * List the vrack.vrackServices objects : vrack for vrackServices
 */
export const getVrackVrackServicesList = async ({
  vrack,
}: GetVrackVrackServicesListParams) =>
  createFetchDataFn<string[]>({
    url: `/vrack/${vrack}/vrackServices`,
    method: 'get',
    apiVersion: 'v6',
  })();
