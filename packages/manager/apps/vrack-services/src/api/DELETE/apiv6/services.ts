import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Task, ResponseData } from '../../api.type';

export type DeletevrackServiceCloudProjectProjectParams = {
  /** publicCloud project */
  project?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceCloudProjectProjectQueryKey = (
  params: DeletevrackServiceCloudProjectProjectParams,
) => [`delete/vrack/${params.serviceName}/cloudProject/${params.project}`];

/**
 * PublicCloud project in vrack : remove this publicCloud project from this vrack
 */
export const deletevrackServiceCloudProjectProject = async (
  params: DeletevrackServiceCloudProjectProjectParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/cloudProject/${params.project}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceCloudProjectProjectQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceDedicatedCloudDedicatedCloudParams = {
  /** your dedicated cloud service */
  dedicatedCloud?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceDedicatedCloudDedicatedCloudQueryKey = (
  params: DeletevrackServiceDedicatedCloudDedicatedCloudParams,
) => [
  `delete/vrack/${params.serviceName}/dedicatedCloud/${params.dedicatedCloud}`,
];

/**
 * VMware on OVHcloud vRack link : Remove VMware on OVHcloud from vRack
 */
export const deletevrackServiceDedicatedCloudDedicatedCloud = async (
  params: DeletevrackServiceDedicatedCloudDedicatedCloudParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/dedicatedCloud/${params.dedicatedCloud}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceDedicatedCloudDedicatedCloudQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceDedicatedConnectNameParams = {
  /** A name for your dedicatedConnect link */
  name?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceDedicatedConnectNameQueryKey = (
  params: DeletevrackServiceDedicatedConnectNameParams,
) => [`delete/vrack/${params.serviceName}/dedicatedConnect/${params.name}`];

/**
 * vrack dedicated connect interface : remove this a dedicatedConnect link from this vrack
 */
export const deletevrackServiceDedicatedConnectName = async (
  params: DeletevrackServiceDedicatedConnectNameParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/dedicatedConnect/${params.name}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceDedicatedConnectNameQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceDedicatedServerDedicatedServerParams = {
  /** Dedicated Server */
  dedicatedServer?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceDedicatedServerDedicatedServerQueryKey = (
  params: DeletevrackServiceDedicatedServerDedicatedServerParams,
) => [
  `delete/vrack/${params.serviceName}/dedicatedServer/${params.dedicatedServer}`,
];

/**
 * vrack dedicated server interfaces (LEGACY) : remove this server from this vrack (LEGACY)
 */
export const deletevrackServiceDedicatedServerDedicatedServer = async (
  params: DeletevrackServiceDedicatedServerDedicatedServerParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/dedicatedServer/${params.dedicatedServer}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceDedicatedServerDedicatedServerQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceDedicatedServerInterfaceDedicatedServerInterfaceParams = {
  /** Dedicated Server Interface */
  dedicatedServerInterface?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceDedicatedServerInterfaceDedicatedServerInterfaceQueryKey = (
  params: DeletevrackServiceDedicatedServerInterfaceDedicatedServerInterfaceParams,
) => [
  `delete/vrack/${params.serviceName}/dedicatedServerInterface/${params.dedicatedServerInterface}`,
];

/**
 * vrack dedicated server interfaces : remove this server interface from this vrack
 */
export const deletevrackServiceDedicatedServerInterfaceDedicatedServerInterface = async (
  params: DeletevrackServiceDedicatedServerInterfaceDedicatedServerInterfaceParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/dedicatedServerInterface/${params.dedicatedServerInterface}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceDedicatedServerInterfaceDedicatedServerInterfaceQueryKey(
      params,
    ),
    fetchData,
  );
};

export type DeletevrackServiceIpIpParams = {
  /** Your IP block */
  ip?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceIpIpQueryKey = (
  params: DeletevrackServiceIpIpParams,
) => [`delete/vrack/${params.serviceName}/ip/${params.ip}`];

/**
 * IP block in vrack : remove this IP block from this vrack
 */
export const deletevrackServiceIpIp = async (
  params: DeletevrackServiceIpIpParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/ip/${params.ip}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceIpIpQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceIpLoadbalancingIpLoadbalancingParams = {
  /** Your ipLoadbalancing */
  ipLoadbalancing?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceIpLoadbalancingIpLoadbalancingQueryKey = (
  params: DeletevrackServiceIpLoadbalancingIpLoadbalancingParams,
) => [
  `delete/vrack/${params.serviceName}/ipLoadbalancing/${params.ipLoadbalancing}`,
];

/**
 * ipLoadbalancing in vrack : remove this ipLoadbalancing from this vrack
 */
export const deletevrackServiceIpLoadbalancingIpLoadbalancing = async (
  params: DeletevrackServiceIpLoadbalancingIpLoadbalancingParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/ipLoadbalancing/${params.ipLoadbalancing}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceIpLoadbalancingIpLoadbalancingQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceLegacyVrackLegacyVrackParams = {
  /** your legacy vrack service */
  legacyVrack?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceLegacyVrackLegacyVrackQueryKey = (
  params: DeletevrackServiceLegacyVrackLegacyVrackParams,
) => [`delete/vrack/${params.serviceName}/legacyVrack/${params.legacyVrack}`];

/**
 * interface between legacy vrack (vrackXXXX) and vrack (pn-XXXX) : remove this legacy vrack (vrackXXXX) from this vrack (pn-XXXX)
 */
export const deletevrackServiceLegacyVrackLegacyVrack = async (
  params: DeletevrackServiceLegacyVrackLegacyVrackParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/legacyVrack/${params.legacyVrack}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceLegacyVrackLegacyVrackQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceNashaZpoolParams = {
  /** The internal name of your vrack */
  serviceName?: string;
  /** Name of Nasha zpool */
  zpool?: string;
};

export const deletevrackServiceNashaZpoolQueryKey = (
  params: DeletevrackServiceNashaZpoolParams,
) => [`delete/vrack/${params.serviceName}/nasha/${params.zpool}`];

/**
 * vrack (1.5) nasha server interfaces : remove this nasha from this vrack (1.5)
 */
export const deletevrackServiceNashaZpool = async (
  params: DeletevrackServiceNashaZpoolParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/nasha/${params.zpool}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceNashaZpoolQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceOvhCloudConnectOvhCloudConnectParams = {
  /** ovhCloudConnect service name */
  ovhCloudConnect?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const deletevrackServiceOvhCloudConnectOvhCloudConnectQueryKey = (
  params: DeletevrackServiceOvhCloudConnectOvhCloudConnectParams,
) => [
  `delete/vrack/${params.serviceName}/ovhCloudConnect/${params.ovhCloudConnect}`,
];

/**
 * ovhCloudConnect in vrack : Remove the ovhCloudConnect from the vrack
 */
export const deletevrackServiceOvhCloudConnectOvhCloudConnect = async (
  params: DeletevrackServiceOvhCloudConnectOvhCloudConnectParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/ovhCloudConnect/${params.ovhCloudConnect}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceOvhCloudConnectOvhCloudConnectQueryKey(params),
    fetchData,
  );
};

export type DeletevrackServiceVrackServicesVrackServicesParams = {
  /** The internal name of your vrack */
  serviceName?: string;
  /** vrackServices service name */
  vrackServices?: string;
};

export const deletevrackServiceVrackServicesVrackServicesQueryKey = (
  params: DeletevrackServiceVrackServicesVrackServicesParams,
) => [
  `delete/vrack/${params.serviceName}/vrackServices/${params.vrackServices}`,
];

/**
 * vrackServices in vrack : Remove the vrackServices from the vrack
 */
export const deletevrackServiceVrackServicesVrackServices = async (
  params: DeletevrackServiceVrackServicesVrackServicesParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.delete(
      `/vrack/${params.serviceName}/vrackServices/${params.vrackServices}`,
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    deletevrackServiceVrackServicesVrackServicesQueryKey(params),
    fetchData,
  );
};
