import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';

type Storage = unknown;
type Partition = unknown;
type IpBlock = unknown;
type Access = unknown;
type Ip = unknown;
type CustomSnap = unknown;
type Options = unknown;
type Quota = unknown;
type SnapshotEnum = unknown;
type Snapshot = unknown;
type UnitAndValue = unknown;
type PartitionUsageTypeEnum = unknown;
type Service = unknown;
type TaskFunctionEnum = unknown;
type TaskStatusEnum = unknown;
type Task = unknown;
type NasUsageTypeEnum = unknown;
type Vrack = unknown;

export const getDedicatedNashaListQueryKey = ['/dedicated/nasha'];

/**
 * Operations about the STORAGE service : List available services
 */
export const getDedicatedNashaList = async (): Promise<string[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get('/dedicated/nasha');
    return response.data;
  };

  return queryClient.fetchQuery(getDedicatedNashaListQueryKey, fetchData);
};

export type GetDedicatedNashaServiceParams = {
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServiceQueryKey = (
  params: GetDedicatedNashaServiceParams,
) => [`/dedicated/nasha/${params.serviceName}`];

/**
 * Storage nas HA : Get this object properties
 */
export const getDedicatedNashaService = async (
  params: GetDedicatedNashaServiceParams,
): Promise<Storage> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServiceQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionListParams = {
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionListQueryKey = (
  params: GetDedicatedNashaServicePartitionListParams,
) => [`/dedicated/nasha/${params.serviceName}/partition`];

/**
 * List the dedicated.nasha.Partition objects : Get partition list
 */
export const getDedicatedNashaServicePartitionList = async (
  params: GetDedicatedNashaServicePartitionListParams,
): Promise<string[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionListQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}`,
];

/**
 * Storage zpool partition : Get this object properties
 */
export const getDedicatedNashaServicePartitionPartitionName = async (
  params: GetDedicatedNashaServicePartitionPartitionNameParams,
): Promise<Partition> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameAccessListParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameAccessListQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameAccessListParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/access`,
];

/**
 * List the dedicated.nasha.Access objects : get ACL for this partition
 */
export const getDedicatedNashaServicePartitionPartitionNameAccessList = async (
  params: GetDedicatedNashaServicePartitionPartitionNameAccessListParams,
): Promise<IpBlock[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/access`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameAccessListQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameAccessIpParams = {
  /** the ip in root on storage */
  ip?: IpBlock;
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameAccessIpQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameAccessIpParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/access/${params.ip}`,
];

/**
 * Define Acl for partition : Get this object properties
 */
export const getDedicatedNashaServicePartitionPartitionNameAccessIp = async (
  params: GetDedicatedNashaServicePartitionPartitionNameAccessIpParams,
): Promise<Access> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/access/${params.ip}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameAccessIpQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameAuthorizableBlocksListParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameAuthorizableBlocksListQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameAuthorizableBlocksListParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/authorizableBlocks`,
];

/**
 * authorizableBlocks operations : Get all RIPE/ARIN blocks that can be used in the ACL
 */
export const getDedicatedNashaServicePartitionPartitionNameAuthorizableBlocksList = async (
  params: GetDedicatedNashaServicePartitionPartitionNameAuthorizableBlocksListParams,
): Promise<IpBlock[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/authorizableBlocks`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameAuthorizableBlocksListQueryKey(
      params,
    ),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameAuthorizableIpsListParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameAuthorizableIpsListQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameAuthorizableIpsListParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/authorizableIps`,
];

/**
 * authorizableIps operations : Get all IPs that can be used in the ACL
 */
export const getDedicatedNashaServicePartitionPartitionNameAuthorizableIpsList = async (
  params: GetDedicatedNashaServicePartitionPartitionNameAuthorizableIpsListParams,
): Promise<Ip[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/authorizableIps`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameAuthorizableIpsListQueryKey(
      params,
    ),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameCustomSnapshotListParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameCustomSnapshotListQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameCustomSnapshotListParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/customSnapshot`,
];

/**
 * List the dedicated.nasha.customSnap objects : Get custom snapshots for this partition
 */
export const getDedicatedNashaServicePartitionPartitionNameCustomSnapshotList = async (
  params: GetDedicatedNashaServicePartitionPartitionNameCustomSnapshotListParams,
): Promise<string[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/customSnapshot`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameCustomSnapshotListQueryKey(
      params,
    ),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameParams = {
  /** name of the snapshot */
  name?: string;
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/customSnapshot/${params.name}`,
];

/**
 * Custom Snapshot : Get this object properties
 */
export const getDedicatedNashaServicePartitionPartitionNameCustomSnapshotName = async (
  params: GetDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameParams,
): Promise<CustomSnap> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/customSnapshot/${params.name}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameQueryKey(
      params,
    ),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameOptionsParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameOptionsQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameOptionsParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/options`,
];

/**
 * Partition options : Get this object properties
 */
export const getDedicatedNashaServicePartitionPartitionNameOptions = async (
  params: GetDedicatedNashaServicePartitionPartitionNameOptionsParams,
): Promise<Options> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/options`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameOptionsQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameQuotaListParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameQuotaListQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameQuotaListParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/quota`,
];

/**
 * List the dedicated.nasha.Quota objects : Get quota for this partition
 */
export const getDedicatedNashaServicePartitionPartitionNameQuotaList = async (
  params: GetDedicatedNashaServicePartitionPartitionNameQuotaListParams,
): Promise<number[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/quota`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameQuotaListQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameQuotaUidParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
  /** the uid to set quota on */
  uid?: number;
};

export const getDedicatedNashaServicePartitionPartitionNameQuotaUidQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameQuotaUidParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/quota/${params.uid}`,
];

/**
 * Partition Quota : Get this object properties
 */
export const getDedicatedNashaServicePartitionPartitionNameQuotaUid = async (
  params: GetDedicatedNashaServicePartitionPartitionNameQuotaUidParams,
): Promise<Quota> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/quota/${params.uid}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameQuotaUidQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameSnapshotListParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServicePartitionPartitionNameSnapshotListQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameSnapshotListParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/snapshot`,
];

/**
 * List the dedicated.nasha.Snapshot objects : Get scheduled snapshot types for this partition
 */
export const getDedicatedNashaServicePartitionPartitionNameSnapshotList = async (
  params: GetDedicatedNashaServicePartitionPartitionNameSnapshotListParams,
): Promise<SnapshotEnum[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/snapshot`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameSnapshotListQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
  /** the interval of snapshot */
  snapshotType?: SnapshotEnum;
};

export const getDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/snapshot/${params.snapshotType}`,
];

/**
 * Partition Snapshot : Get this object properties
 */
export const getDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotType = async (
  params: GetDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeParams,
): Promise<Snapshot> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/snapshot/${params.snapshotType}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeQueryKey(
      params,
    ),
    fetchData,
  );
};

export type GetDedicatedNashaServicePartitionPartitionNameUseParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
  /** The type of statistic to be fetched */
  type?: PartitionUsageTypeEnum;
};

export const getDedicatedNashaServicePartitionPartitionNameUseQueryKey = (
  params: GetDedicatedNashaServicePartitionPartitionNameUseParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/use`,
];

/**
 * use operations : Return statistics about the partition
 */
export const getDedicatedNashaServicePartitionPartitionNameUse = async (
  params: GetDedicatedNashaServicePartitionPartitionNameUseParams,
): Promise<UnitAndValue> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/use`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServicePartitionPartitionNameUseQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServiceServiceInfosParams = {
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServiceServiceInfosQueryKey = (
  params: GetDedicatedNashaServiceServiceInfosParams,
) => [`/dedicated/nasha/${params.serviceName}/serviceInfos`];

/**
 * Details about a Service : Get this object properties
 */
export const getDedicatedNashaServiceServiceInfos = async (
  params: GetDedicatedNashaServiceServiceInfosParams,
): Promise<Service> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/serviceInfos`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServiceServiceInfosQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServiceTaskListParams = {
  /** Filter the value of operation property (&#x3D;) */
  operation: TaskFunctionEnum;
  /** The internal name of your storage */
  serviceName?: string;
  /** Filter the value of status property (&#x3D;) */
  status: TaskStatusEnum;
};

export const getDedicatedNashaServiceTaskListQueryKey = (
  params: GetDedicatedNashaServiceTaskListParams,
) => [`/dedicated/nasha/${params.serviceName}/task`];

/**
 * List the dedicated.nasTask.Task objects : View task list
 */
export const getDedicatedNashaServiceTaskList = async (
  params: GetDedicatedNashaServiceTaskListParams,
): Promise<number[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/task`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServiceTaskListQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServiceTaskTaskIdParams = {
  /** The internal name of your storage */
  serviceName?: string;
  /** id of the task */
  taskId?: number;
};

export const getDedicatedNashaServiceTaskTaskIdQueryKey = (
  params: GetDedicatedNashaServiceTaskTaskIdParams,
) => [`/dedicated/nasha/${params.serviceName}/task/${params.taskId}`];

/**
 * Storage task : Get this object properties
 */
export const getDedicatedNashaServiceTaskTaskId = async (
  params: GetDedicatedNashaServiceTaskTaskIdParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/task/${params.taskId}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServiceTaskTaskIdQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServiceUseParams = {
  /** The internal name of your storage */
  serviceName?: string;
  /** The type of statistic to be fetched */
  type?: NasUsageTypeEnum;
};

export const getDedicatedNashaServiceUseQueryKey = (
  params: GetDedicatedNashaServiceUseParams,
) => [`/dedicated/nasha/${params.serviceName}/use`];

/**
 * use operations : Return statistics about the nas
 */
export const getDedicatedNashaServiceUse = async (
  params: GetDedicatedNashaServiceUseParams,
): Promise<UnitAndValue> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/use`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServiceUseQueryKey(params),
    fetchData,
  );
};

export type GetDedicatedNashaServiceVrackParams = {
  /** The internal name of your storage */
  serviceName?: string;
};

export const getDedicatedNashaServiceVrackQueryKey = (
  params: GetDedicatedNashaServiceVrackParams,
) => [`/dedicated/nasha/${params.serviceName}/vrack`];

/**
 * Partition Vrack : Get this object properties
 */
export const getDedicatedNashaServiceVrack = async (
  params: GetDedicatedNashaServiceVrackParams,
): Promise<Vrack> => {
  const fetchData = async () => {
    const response = await apiClient.v6.get(
      `/dedicated/nasha/${params.serviceName}/vrack`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    getDedicatedNashaServiceVrackQueryKey(params),
    fetchData,
  );
};
