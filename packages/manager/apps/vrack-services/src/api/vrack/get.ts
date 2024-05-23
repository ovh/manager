import { ApiError, ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import {
  AllowedServicesResponse,
  AllowedService,
  EligibleServicesResponse,
  NonExpiringService,
  VrackTask,
} from '../api.type';

export const getVrackListQueryKey = ['get/vrack'];

export const getVrackList = () => apiClient.v6.get<string[]>('/vrack');

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
  apiClient.v6.get<AllowedServicesResponse>(
    `/vrack/${vrack}/allowedServices${
      serviceFamily ? `?serviceFamily=${serviceFamily}` : ''
    }`,
  );

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
  apiClient.v6.get<EligibleServicesResponse>(
    `/vrack/${vrack}/eligibleServices`,
  );

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
  apiClient.v6.get<NonExpiringService>(`/vrack/${vrack}/serviceInfos`);

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
  apiClient.v6.get<string[]>(`/vrack/${vrack}/vrackServices`);

export type GetVrackTaskWithIdParams = {
  /** The internal name of your vrack */
  vrack: string;
  /** The task ID */
  taskId: number;
};

export const getVrackTaskWithIdQueryKey = ({
  vrack,
  taskId,
}: GetVrackTaskWithIdParams) => [`get/vrack/task`, { taskId, vrack }];

/**
 * Retrieve a given vrack task
 * @param vrack the vrack id
 * @param taskId the task id
 * @returns the detail of the task
 */
export const getVrackTaskWithId = async ({
  vrack,
  taskId,
}: GetVrackTaskWithIdParams) =>
  apiClient.v6.get<VrackTask>(`/vrack/${vrack}/task/${taskId}`);
