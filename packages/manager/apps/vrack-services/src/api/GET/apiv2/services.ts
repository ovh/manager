import { queryClient } from '@ovh-ux/manager-react-core-application';
import { fetchIceberg, apiClient } from '@ovh-ux/manager-core-api';
import {
  EligibleManagedService,
  Event,
  Task,
  VrackServicesWithIAM,
  Zone,
  ResponseData,
} from '../../api.type';

export const getvrackServicesReferenceCompatibleProductListQueryKey = [
  'get/vrackServices/reference/compatibleProduct',
];

/**
 * List all products that are compatible with vRack Services
 */
export const getvrackServicesReferenceCompatibleProductList = async (): Promise<{
  data: string[];
}> => {
  const fetchData = async () => {
    const response: ResponseData<string[]> = await apiClient.v2.get(
      '/vrackServices/reference/compatibleProduct',
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { data: response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesReferenceCompatibleProductListQueryKey,
    fetchData,
  );
};

export const getvrackServicesReferenceEventKindListQueryKey = [
  'get/vrackServices/reference/event/kind',
];

/**
 *  : List all kind of event
 */
export const getvrackServicesReferenceEventKindList = async (): Promise<{
  data: string[];
}> => {
  const fetchData = async () => {
    const response: ResponseData<string[]> = await apiClient.v2.get(
      '/vrackServices/reference/event/kind',
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { data: response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesReferenceEventKindListQueryKey,
    fetchData,
  );
};

export const getvrackServicesReferenceEventTypeListQueryKey = [
  'get/vrackServices/reference/event/type',
];

/**
 *  : List all type of event
 */
export const getvrackServicesReferenceEventTypeList = async (): Promise<{
  data: string[];
}> => {
  const fetchData = async () => {
    const response: ResponseData<string[]> = await apiClient.v2.get(
      '/vrackServices/reference/event/type',
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { data: response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesReferenceEventTypeListQueryKey,
    fetchData,
  );
};

export const getvrackServicesReferenceZoneListQueryKey = [
  'get/vrackServices/reference/zone',
];

/**
 *  : List all vRack Services zones
 */
export const getvrackServicesReferenceZoneList = async (): Promise<{
  data: Zone[];
  status: number;
}> => {
  const fetchData = async () => {
    const response: ResponseData<Zone[]> = await apiClient.v2.get(
      '/vrackServices/reference/zone',
    );
    if (response?.code?.startsWith('ERR') || response.status !== 200) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { data: response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesReferenceZoneListQueryKey,
    fetchData,
  );
};

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
  data: GetvrackServicesResourceListParams,
): Promise<VrackServicesWithIAM[]> => {
  const fetchData = async () => {
    const response: ResponseData<VrackServicesWithIAM[]> = await apiClient.v2.get(
      '/vrackServices/resource',
      {
        data,
      },
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesResourceListQueryKey,
    fetchData,
  );
};

/**
 * Get listing with iceberg
 */
export const getListingIceberg = async () => {
  try {
    const { data, status } = await fetchIceberg<VrackServicesWithIAM>({
      route: '/vrackServices/resource',
      apiVersion: 'v2',
    });
    return { data, status };
  } catch (error) {
    return null;
  }
};

export type GetvrackServicesResourceVrackServicesIdParams = {
  /** Vrack services ID */
  vrackServicesId?: string;
};

export const getvrackServicesResourceVrackServicesIdQueryKey = (
  params: GetvrackServicesResourceVrackServicesIdParams,
) => [`get/vrackServices/resource/${params.vrackServicesId}`];

/**
 * Operations on vRack Services : Get the vRack Services
 */
export const getvrackServicesResourceVrackServicesId = async (
  params: GetvrackServicesResourceVrackServicesIdParams,
): Promise<VrackServicesWithIAM> => {
  const fetchData = async () => {
    const response: ResponseData<VrackServicesWithIAM> = await apiClient.v2.get(
      `/vrackServices/resource/${params.vrackServicesId}`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdQueryKey(params),
    fetchData,
  );
};

export type GetvrackServicesResourceVrackServicesIdEligibleManagedServiceListParams = {
  /** Vrack services ID */
  vrackServicesId?: string;
};

export const getvrackServicesResourceVrackServicesIdEligibleManagedServiceListQueryKey = (
  data: GetvrackServicesResourceVrackServicesIdEligibleManagedServiceListParams,
) => [
  `get/vrackServices/resource/${data.vrackServicesId}/eligibleManagedService`,
];

/**
 *  : List all managed services eligible to the requested vRack Services
 */
export const getvrackServicesResourceVrackServicesIdEligibleManagedServiceList = async (
  data: GetvrackServicesResourceVrackServicesIdEligibleManagedServiceListParams,
): Promise<{ data: EligibleManagedService[] }> => {
  const fetchData = async () => {
    const response: ResponseData<EligibleManagedService[]> = await apiClient.v2.get(
      `/vrackServices/resource/${data.vrackServicesId}/eligibleManagedService`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { data: response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdEligibleManagedServiceListQueryKey(
      data,
    ),
    fetchData,
  );
};

export type GetvrackServicesResourceVrackServicesIdEventListParams = {
  /** Vrack services ID */
  vrackServicesId?: string;
};

export const getvrackServicesResourceVrackServicesIdEventListQueryKey = (
  params: GetvrackServicesResourceVrackServicesIdEventListParams,
) => [`get/vrackServices/resource/${params.vrackServicesId}/event`];

/**
 * vRack Services actions history : List all events that happened on the vRack Services
 */
export const getvrackServicesResourceVrackServicesIdEventList = async (
  params: GetvrackServicesResourceVrackServicesIdEventListParams,
): Promise<{ data: Event[] }> => {
  const fetchData = async () => {
    const response: ResponseData<Event[]> = await apiClient.v2.get(
      `/vrackServices/resource/${params.vrackServicesId}/event`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { data: response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdEventListQueryKey(params),
    fetchData,
  );
};

export type GetvrackServicesResourceVrackServicesIdTaskListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': string;
  /** Vrack services ID */
  vrackServicesId?: string;
};

export const getvrackServicesResourceVrackServicesIdTaskListQueryKey = (
  params: GetvrackServicesResourceVrackServicesIdTaskListParams,
) => [`get/vrackServices/resource/${params.vrackServicesId}/task`];

/**
 * vRack Services tasks : List all asynchronous operations related to the vRack Services
 */
export const getvrackServicesResourceVrackServicesIdTaskList = async (
  params: GetvrackServicesResourceVrackServicesIdTaskListParams,
): Promise<{ data: Task[] }> => {
  const fetchData = async () => {
    const response: ResponseData<Task[]> = await apiClient.v2.get(
      `/vrackServices/resource/${params.vrackServicesId}/task`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { data: response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdTaskListQueryKey(params),
    fetchData,
  );
};

export type GetvrackServicesResourceVrackServicesIdTaskTaskIdParams = {
  /** Task ID */
  taskId?: string;
  /** Vrack services ID */
  vrackServicesId?: string;
};

export const getvrackServicesResourceVrackServicesIdTaskTaskIdQueryKey = (
  params: GetvrackServicesResourceVrackServicesIdTaskTaskIdParams,
) => [
  `get/vrackServices/resource/${params.vrackServicesId}/task/${params.taskId}`,
];

/**
 * vRack Services tasks : Get the task
 */
export const getvrackServicesResourceVrackServicesIdTaskTaskId = async (
  params: GetvrackServicesResourceVrackServicesIdTaskTaskIdParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v2.get(
      `/vrackServices/resource/${params.vrackServicesId}/task/${params.taskId}`,
    );
    if (response?.code?.startsWith('ERR')) {
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response.status };
  };

  return queryClient.fetchQuery(
    getvrackServicesResourceVrackServicesIdTaskTaskIdQueryKey(params),
    fetchData,
  );
};
