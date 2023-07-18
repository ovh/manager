import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Task, ResponseData } from '../../api.type';

export type PostvrackServiceChangeContactListParams = {
  /** The contact to set as admin contact */
  contactAdmin: string;
  /** The contact to set as billing contact */
  contactBilling: string;
  /** The contact to set as tech contact */
  contactTech: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceChangeContactListQueryKey = (
  params: PostvrackServiceChangeContactListParams,
) => [`post/vrack/${params.serviceName}/changeContact`];

/**
 * Change the contacts of this service : Launch a contact change procedure
 */
export const postvrackServiceChangeContactList = async (
  params: PostvrackServiceChangeContactListParams,
): Promise<number[]> => {
  const fetchData = async () => {
    const response: ResponseData<number[]> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/changeContact`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceChangeContactListQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceCloudProjectParams = {
  /** publicCloud project to add */
  project?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceCloudProjectQueryKey = (
  params: PostvrackServiceCloudProjectParams,
) => [`post/vrack/${params.serviceName}/cloudProject`];

/**
 * List the vrack.cloudProject objects : add a publicCloud project to this vrack
 */
export const postvrackServiceCloudProject = async (
  params: PostvrackServiceCloudProjectParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/cloudProject`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceCloudProjectQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceDedicatedCloudParams = {
  /**  */
  dedicatedCloud?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceDedicatedCloudQueryKey = (
  params: PostvrackServiceDedicatedCloudParams,
) => [`post/vrack/${params.serviceName}/dedicatedCloud`];

/**
 * List the vrack.dedicatedCloud objects : Add VMware on OVHcloud to vRack
 */
export const postvrackServiceDedicatedCloud = async (
  params: PostvrackServiceDedicatedCloudParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/dedicatedCloud`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceDedicatedCloudQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceDedicatedCloudDatacenterDatacenterMoveParams = {
  /** Your dedicatedCloud datacenter name */
  datacenter?: string;
  /** The internal name of your vrack */
  serviceName?: string;
  /** The internal name of your target vrack */
  targetServiceName?: string;
};

export const postvrackServiceDedicatedCloudDatacenterDatacenterMoveQueryKey = (
  params: PostvrackServiceDedicatedCloudDatacenterDatacenterMoveParams,
) => [
  `post/vrack/${params.serviceName}/dedicatedCloudDatacenter/${params.datacenter}/move`,
];

/**
 * move operations : Move your dedicatedCloud datacenter from a Vrack to another
 */
export const postvrackServiceDedicatedCloudDatacenterDatacenterMove = async (
  params: PostvrackServiceDedicatedCloudDatacenterDatacenterMoveParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/dedicatedCloudDatacenter/${params.datacenter}/move`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceDedicatedCloudDatacenterDatacenterMoveQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceDedicatedConnectParams = {
  /** Hostname of the network device where the dedicatedConnect link is connected to */
  entryPointSwitch?: string;
  /** A name for the dedicatedConnect link */
  name?: string;
  /** The internal name of your vrack */
  serviceName?: string;
  /** Vlan id of the dedicated link on OVH&#x27;s G5 router */
  vlanId?: number;
};

export const postvrackServiceDedicatedConnectQueryKey = (
  params: PostvrackServiceDedicatedConnectParams,
) => [`post/vrack/${params.serviceName}/dedicatedConnect`];

/**
 * List the vrack.dedicatedConnect objects : add a dedicatedConnect link to this vrack
 */
export const postvrackServiceDedicatedConnect = async (
  params: PostvrackServiceDedicatedConnectParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/dedicatedConnect`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceDedicatedConnectQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceDedicatedServerParams = {
  /** Dedicated server to add  */
  dedicatedServer?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceDedicatedServerQueryKey = (
  params: PostvrackServiceDedicatedServerParams,
) => [`post/vrack/${params.serviceName}/dedicatedServer`];

/**
 * List the vrack.dedicatedServer objects : add a dedicated server to this vrack (LEGACY)
 */
export const postvrackServiceDedicatedServer = async (
  params: PostvrackServiceDedicatedServerParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/dedicatedServer`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceDedicatedServerQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceDedicatedServerInterfaceParams = {
  /** Dedicated server interface to add  */
  dedicatedServerInterface?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceDedicatedServerInterfaceQueryKey = (
  params: PostvrackServiceDedicatedServerInterfaceParams,
) => [`post/vrack/${params.serviceName}/dedicatedServerInterface`];

/**
 * List the vrack.dedicatedServerInterface objects : add a dedicated server interface to this vrack
 */
export const postvrackServiceDedicatedServerInterface = async (
  params: PostvrackServiceDedicatedServerInterfaceParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/dedicatedServerInterface`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceDedicatedServerInterfaceQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceIpParams = {
  /** Your IP block */
  block?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceIpQueryKey = (
  params: PostvrackServiceIpParams,
) => [`post/vrack/${params.serviceName}/ip`];

/**
 * List the vrack.ip objects : add an IP block to this vrack
 */
export const postvrackServiceIp = async (
  params: PostvrackServiceIpParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/ip`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(postvrackServiceIpQueryKey(params), fetchData);
};

export type PostvrackServiceIpIpAnnounceInZoneParams = {
  /** Your IP block */
  ip?: string;
  /** The internal name of your vrack */
  serviceName?: string;
  /** Zone to announce in */
  zone?: string;
};

export const postvrackServiceIpIpAnnounceInZoneQueryKey = (
  params: PostvrackServiceIpIpAnnounceInZoneParams,
) => [`post/vrack/${params.serviceName}/ip/${params.ip}/announceInZone`];

/**
 * announceInZone operations : Announce IP to zone for vrack
 */
export const postvrackServiceIpIpAnnounceInZone = async (
  params: PostvrackServiceIpIpAnnounceInZoneParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/ip/${params.ip}/announceInZone`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceIpIpAnnounceInZoneQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceIpLoadbalancingParams = {
  /** Your ipLoadbalancing */
  ipLoadbalancing?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceIpLoadbalancingQueryKey = (
  params: PostvrackServiceIpLoadbalancingParams,
) => [`post/vrack/${params.serviceName}/ipLoadbalancing`];

/**
 * List the vrack.iplb objects : add an ipLoadbalancing to this vrack
 */
export const postvrackServiceIpLoadbalancing = async (
  params: PostvrackServiceIpLoadbalancingParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/ipLoadbalancing`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceIpLoadbalancingQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceLegacyVrackParams = {
  /**  */
  legacyVrack?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceLegacyVrackQueryKey = (
  params: PostvrackServiceLegacyVrackParams,
) => [`post/vrack/${params.serviceName}/legacyVrack`];

/**
 * List the vrack.legacyVrack objects : add a legacy vrack (vrackXXXX) to this vrack (pn-XXXX)
 */
export const postvrackServiceLegacyVrack = async (
  params: PostvrackServiceLegacyVrackParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/legacyVrack`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceLegacyVrackQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceNashaParams = {
  /** service ip */
  serviceIp?: string;
  /** The internal name of your vrack */
  serviceName?: string;
  /** Nasha */
  zpool?: string;
};

export const postvrackServiceNashaQueryKey = (
  params: PostvrackServiceNashaParams,
) => [`post/vrack/${params.serviceName}/nasha`];

/**
 * List the vrack.nasha objects : add a nasha to this vrack (1.5)
 */
export const postvrackServiceNasha = async (
  params: PostvrackServiceNashaParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/nasha`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceNashaQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceOvhCloudConnectParams = {
  /** ovhCloudConnect service name */
  ovhCloudConnect?: string;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const postvrackServiceOvhCloudConnectQueryKey = (
  params: PostvrackServiceOvhCloudConnectParams,
) => [`post/vrack/${params.serviceName}/ovhCloudConnect`];

/**
 * List the vrack.ovhCloudConnect objects : Add an ovhCloudConnect to the vrack
 */
export const postvrackServiceOvhCloudConnect = async (
  params: PostvrackServiceOvhCloudConnectParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/ovhCloudConnect`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceOvhCloudConnectQueryKey(params),
    fetchData,
  );
};

export type PostvrackServiceVrackServicesParams = {
  /** The internal name of your vrack */
  serviceName?: string;
  /** vrackServices service name */
  vrackServices?: string;
};

export const postvrackServiceVrackServicesQueryKey = (
  params: PostvrackServiceVrackServicesParams,
) => [`post/vrack/${params.serviceName}/vrackServices`];

/**
 * List the vrack.vrackServices objects : Add a vrackServices to the vrack
 */
export const postvrackServiceVrackServices = async (
  params: PostvrackServiceVrackServicesParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response: ResponseData<Task> = await apiClient.v6.post(
      `/vrack/${params.serviceName}/vrackServices`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    postvrackServiceVrackServicesQueryKey(params),
    fetchData,
  );
};
