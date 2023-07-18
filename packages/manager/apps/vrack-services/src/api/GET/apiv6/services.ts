import { queryClient } from '@ovh-ux/manager-react-core-application';
import { apiClient } from '@ovh-ux/manager-core-api';
import {
  ResponseData,
  VrackWithIAM,
  AllowedServices,
  AllowedServiceEnum,
  EligibleServicesResponse,
  IpBlock,
  NonExpiringService,
  Task,
  VrackServices,
} from '../../api.type';

export const getVrackListQueryKey = ['get/vrack'];

/**
 * Operations about the VRACK service : List available services
 */
export const getVrackList = async (): Promise<string[]> => {
  const fetchData = async () => {
    const response: ResponseData<string[]> = await apiClient.v6.get('/vrack');
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(getVrackListQueryKey, fetchData);
};

export type GetVrackServiceParams = {
  /** The internal name of your vrack */
  serviceName?: string;
};

export const getVrackServiceQueryKey = (params: GetVrackServiceParams) => [
  `get/vrack/${params.serviceName}`,
];

/**
 * vrack : Get this object properties
 */
export const getVrackService = async (
  params: GetVrackServiceParams,
): Promise<VrackWithIAM> => {
  const fetchData = async () => {
    const response: ResponseData<VrackWithIAM> = await apiClient.v6.get(
      `/vrack/${params.serviceName}`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(getVrackServiceQueryKey(params), fetchData);
};

export type GetVrackServiceAllowedServicesParams = {
  /** Filter on a specific service family */
  serviceFamily: AllowedServiceEnum;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const getVrackServiceAllowedServicesQueryKey = (
  params: GetVrackServiceAllowedServicesParams,
) => [`get/vrack/${params.serviceName}/allowedServices`];

/**
 * allowedServices operations : List all services allowed in this vrack
 */
export const getVrackServiceAllowedServices = async (
  params: GetVrackServiceAllowedServicesParams,
): Promise<AllowedServices> => {
  const fetchData = async () => {
    const response: ResponseData<AllowedServices> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/allowedServices`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceAllowedServicesQueryKey(params),
    fetchData,
  );
};

export type GetVrackServiceCloudProjectListParams = {
  /** The internal name of your vrack */
  serviceName?: string;
};

export const getVrackServiceCloudProjectListQueryKey = (
  params: GetVrackServiceCloudProjectListParams,
) => [`get/vrack/${params.serviceName}/cloudProject`];

/**
 * List the vrack.cloudProject objects : vrack for publicCloud project
 */
export const getVrackServiceCloudProjectList = async (
  params: GetVrackServiceCloudProjectListParams,
): Promise<string[]> => {
  const fetchData = async () => {
    const response: ResponseData<string[]> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/cloudProject`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceCloudProjectListQueryKey(params),
    fetchData,
  );
};

export type GetVrackServiceEligibleServicesParams = {
  /** The internal name of your vrack */
  serviceName?: string;
};

export const getVrackServiceEligibleServicesQueryKey = (
  params: GetVrackServiceEligibleServicesParams,
) => [`get/vrack/${params.serviceName}/eligibleServices`];

/**
 * List all eligible services for this vRack asynchronously : List all eligible services for this vRack asynchronously
 */
export const getVrackServiceEligibleServices = async (
  params: GetVrackServiceEligibleServicesParams,
): Promise<EligibleServicesResponse> => {
  const fetchData = async () => {
    const response: ResponseData<EligibleServicesResponse> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/eligibleServices`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceEligibleServicesQueryKey(params),
    fetchData,
  );
};

export type GetVrackServiceIpIpAvailableZoneListParams = {
  /** Your IP block */
  ip?: IpBlock;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const getVrackServiceIpIpAvailableZoneListQueryKey = (
  params: GetVrackServiceIpIpAvailableZoneListParams,
) => [`get/vrack/${params.serviceName}/ip/${params.ip}/availableZone`];

/**
 * availableZone operations : Zone available to announce your block
 */
export const getVrackServiceIpIpAvailableZoneList = async (
  params: GetVrackServiceIpIpAvailableZoneListParams,
): Promise<{ data: string[]; status: number }> => {
  const fetchData = async () => {
    const response: ResponseData<string> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/ip/${params.ip}/availableZone`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { data: response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceIpIpAvailableZoneListQueryKey(params),
    fetchData,
  );
};

export type GetVrackServiceServiceInfosParams = {
  /** The internal name of your vrack */
  serviceName?: string;
};

export const getVrackServiceServiceInfosQueryKey = (
  params: GetVrackServiceServiceInfosParams,
) => [`get/vrack/${params.serviceName}/serviceInfos`];

/**
 * Details about a non-expiring Service : Get this object properties
 */
export const getVrackServiceServiceInfos = async (
  params: GetVrackServiceServiceInfosParams,
): Promise<NonExpiringService> => {
  const fetchData = async () => {
    const response: ResponseData<NonExpiringService> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/serviceInfos`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceServiceInfosQueryKey(params),
    fetchData,
  );
};

export type GetVrackServiceTaskListParams = {
  /** The internal name of your vrack */
  serviceName?: string;
};

export const getVrackServiceTaskListQueryKey = (
  params: GetVrackServiceTaskListParams,
) => [`get/vrack/${params.serviceName}/task`];

/**
 * List the vrack.Task objects : vrack tasks
 */
export const getVrackServiceTaskList = async (
  params: GetVrackServiceTaskListParams,
): Promise<number[]> => {
  const fetchData = async () => {
    const response: ResponseData<number[]> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/task`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceTaskListQueryKey(params),
    fetchData,
  );
};

export type GetVrackServiceTaskTaskIdParams = {
  /** The internal name of your vrack */
  serviceName?: string;
  /**  */
  taskId?: number;
};

export const getVrackServiceTaskTaskIdQueryKey = (
  params: GetVrackServiceTaskTaskIdParams,
) => [`get/vrack/${params.serviceName}/task/${params.taskId}`];

/**
 * vrack tasks : Get this object properties
 */
export const getVrackServiceTaskTaskId = async (
  params: GetVrackServiceTaskTaskIdParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/task/${params.taskId}`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceTaskTaskIdQueryKey(params),
    fetchData,
  );
};

export type GetVrackServiceVrackServicesListParams = {
  /** The internal name of your vrack */
  serviceName?: string;
};

export const getVrackServiceVrackServicesListQueryKey = (
  params: GetVrackServiceVrackServicesListParams,
) => [`get/vrack/${params.serviceName}/vrackServices`];

/**
 * List the vrack.vrackServices objects : vrack for vrackServices
 */
export const getVrackServiceVrackServicesList = async (
  params: GetVrackServiceVrackServicesListParams,
): Promise<string[]> => {
  const fetchData = async () => {
    const response: ResponseData<string[]> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/vrackServices`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceVrackServicesListQueryKey(params),
    fetchData,
  );
};

export type GetVrackServiceVrackServicesVrackServicesParams = {
  /** The internal name of your vrack */
  serviceName?: string;
  /** vrackServices service name */
  vrackServices?: string;
};

export const getVrackServiceVrackServicesVrackServicesQueryKey = (
  params: GetVrackServiceVrackServicesVrackServicesParams,
) => [`get/vrack/${params.serviceName}/vrackServices/${params.vrackServices}`];

/**
 * vrackServices in vrack : Get this object properties
 */
export const getVrackServiceVrackServicesVrackServices = async (
  params: GetVrackServiceVrackServicesVrackServicesParams,
): Promise<VrackServices> => {
  const fetchData = async () => {
    const response: ResponseData<VrackServices> = await apiClient.v6.get(
      `/vrack/${params.serviceName}/vrackServices/${params.vrackServices}`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getVrackServiceVrackServicesVrackServicesQueryKey(params),
    fetchData,
  );
};
