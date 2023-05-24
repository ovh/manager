import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';

type AccountId = unknown;
type TerminationFutureUseEnum = unknown;
type TerminationReasonEnum = unknown;
type Task = unknown;
type ProtocolEnum = unknown;
type IpBlock = unknown;
type AclTypeEnum = unknown;
type AtimeEnum = unknown;
type RecordSizeEnum = unknown;
type SyncEnum = unknown;
type SnapshotEnum = unknown;
type IpInterface = unknown;

export type PostDedicatedNashaServiceChangeContactListParams = {
  /** The contact to set as admin contact */
  contactAdmin: AccountId;
  /** The contact to set as billing contact */
  contactBilling: AccountId;
  /** The contact to set as tech contact */
  contactTech: AccountId;
  /** The internal name of your storage */
  serviceName?: string;
};

export const postDedicatedNashaServiceChangeContactListQueryKey = (
  params: PostDedicatedNashaServiceChangeContactListParams,
) => [`/dedicated/nasha/${params.serviceName}/changeContact`];

/**
 * Change the contacts of this service : Launch a contact change procedure
 */
export const postDedicatedNashaServiceChangeContactList = async (
  params: PostDedicatedNashaServiceChangeContactListParams,
): Promise<number[]> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/changeContact`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServiceChangeContactListQueryKey(params),
    fetchData,
  );
};

export type PostDedicatedNashaServiceConfirmTerminationParams = {
  /** Commentary about your termination request */
  commentary: string;
  /** What next after your termination request */
  futureUse: TerminationFutureUseEnum;
  /** Reason of your termination request */
  reason: TerminationReasonEnum;
  /** The internal name of your storage */
  serviceName?: string;
  /** The termination token sent by mail to the admin contact */
  token?: string;
};

export const postDedicatedNashaServiceConfirmTerminationQueryKey = (
  params: PostDedicatedNashaServiceConfirmTerminationParams,
) => [`/dedicated/nasha/${params.serviceName}/confirmTermination`];

/**
 * Confirm termination of your service : Confirm termination of your service
 */
export const postDedicatedNashaServiceConfirmTermination = async (
  params: PostDedicatedNashaServiceConfirmTerminationParams,
): Promise<string> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/confirmTermination`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServiceConfirmTerminationQueryKey(params),
    fetchData,
  );
};

export type PostDedicatedNashaServicePartitionParams = {
  /** Partition description */
  partitionDescription: string;
  /** Partition name */
  partitionName?: string;
  /** NFS|CIFS|NFS_CIFS */
  protocol?: ProtocolEnum;
  /** The internal name of your storage */
  serviceName?: string;
  /** Partition size */
  size?: number;
};

export const postDedicatedNashaServicePartitionQueryKey = (
  params: PostDedicatedNashaServicePartitionParams,
) => [`/dedicated/nasha/${params.serviceName}/partition`];

/**
 * List the dedicated.nasha.Partition objects : Create a new partition
 */
export const postDedicatedNashaServicePartition = async (
  params: PostDedicatedNashaServicePartitionParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/partition`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServicePartitionQueryKey(params),
    fetchData,
  );
};

export type PostDedicatedNashaServicePartitionPartitionNameAccessParams = {
  /** Ip or block to add */
  ip?: IpBlock;
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
  /** ACL type */
  type: AclTypeEnum;
};

export const postDedicatedNashaServicePartitionPartitionNameAccessQueryKey = (
  params: PostDedicatedNashaServicePartitionPartitionNameAccessParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/access`,
];

/**
 * List the dedicated.nasha.Access objects : Add a new ACL entry
 */
export const postDedicatedNashaServicePartitionPartitionNameAccess = async (
  params: PostDedicatedNashaServicePartitionPartitionNameAccessParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/access`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServicePartitionPartitionNameAccessQueryKey(params),
    fetchData,
  );
};

export type PostDedicatedNashaServicePartitionPartitionNameCustomSnapshotParams = {
  /** optional expiration date/time, in iso8601 format */
  expiration: string;
  /** the name of the snapshot */
  name?: string;
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const postDedicatedNashaServicePartitionPartitionNameCustomSnapshotQueryKey = (
  params: PostDedicatedNashaServicePartitionPartitionNameCustomSnapshotParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/customSnapshot`,
];

/**
 * List the dedicated.nasha.customSnap objects : Create a new snapshot
 */
export const postDedicatedNashaServicePartitionPartitionNameCustomSnapshot = async (
  params: PostDedicatedNashaServicePartitionPartitionNameCustomSnapshotParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/customSnapshot`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServicePartitionPartitionNameCustomSnapshotQueryKey(
      params,
    ),
    fetchData,
  );
};

export type PostDedicatedNashaServicePartitionPartitionNameOptionsParams = {
  /** atime setting */
  atime: AtimeEnum;
  /** the given name of partition */
  partitionName?: string;
  /** ZFS recordsize */
  recordsize: RecordSizeEnum;
  /** The internal name of your storage */
  serviceName?: string;
  /** sync setting */
  sync: SyncEnum;
};

export const postDedicatedNashaServicePartitionPartitionNameOptionsQueryKey = (
  params: PostDedicatedNashaServicePartitionPartitionNameOptionsParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/options`,
];

/**
 * Partition options : Setup options
 */
export const postDedicatedNashaServicePartitionPartitionNameOptions = async (
  params: PostDedicatedNashaServicePartitionPartitionNameOptionsParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/options`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServicePartitionPartitionNameOptionsQueryKey(params),
    fetchData,
  );
};

export type PostDedicatedNashaServicePartitionPartitionNameQuotaParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
  /** the size to set in MB */
  size?: number;
  /** the uid to set quota on */
  uid?: number;
};

export const postDedicatedNashaServicePartitionPartitionNameQuotaQueryKey = (
  params: PostDedicatedNashaServicePartitionPartitionNameQuotaParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/quota`,
];

/**
 * List the dedicated.nasha.Quota objects : Set a new quota
 */
export const postDedicatedNashaServicePartitionPartitionNameQuota = async (
  params: PostDedicatedNashaServicePartitionPartitionNameQuotaParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/quota`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServicePartitionPartitionNameQuotaQueryKey(params),
    fetchData,
  );
};

export type PostDedicatedNashaServicePartitionPartitionNameSnapshotParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
  /** Snapshot interval to add */
  snapshotType?: SnapshotEnum;
};

export const postDedicatedNashaServicePartitionPartitionNameSnapshotQueryKey = (
  params: PostDedicatedNashaServicePartitionPartitionNameSnapshotParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/snapshot`,
];

/**
 * List the dedicated.nasha.Snapshot objects : Schedule a new snapshot type
 */
export const postDedicatedNashaServicePartitionPartitionNameSnapshot = async (
  params: PostDedicatedNashaServicePartitionPartitionNameSnapshotParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/snapshot`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServicePartitionPartitionNameSnapshotQueryKey(params),
    fetchData,
  );
};

export type PostDedicatedNashaServiceTerminateParams = {
  /** The internal name of your storage */
  serviceName?: string;
};

export const postDedicatedNashaServiceTerminateQueryKey = (
  params: PostDedicatedNashaServiceTerminateParams,
) => [`/dedicated/nasha/${params.serviceName}/terminate`];

/**
 * Terminate your service : Terminate your service
 */
export const postDedicatedNashaServiceTerminate = async (
  params: PostDedicatedNashaServiceTerminateParams,
): Promise<string> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/terminate`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServiceTerminateQueryKey(params),
    fetchData,
  );
};

export type PostDedicatedNashaServiceVrackIpParams = {
  /** The Ip of the nasha service to setup */
  serviceIp?: IpInterface;
  /** The internal name of your storage */
  serviceName?: string;
};

export const postDedicatedNashaServiceVrackIpQueryKey = (
  params: PostDedicatedNashaServiceVrackIpParams,
) => [`/dedicated/nasha/${params.serviceName}/vrack/ip`];

/**
 * ip operations : Update the nasha service Ip
 */
export const postDedicatedNashaServiceVrackIp = async (
  params: PostDedicatedNashaServiceVrackIpParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.post(
      `/dedicated/nasha/${params.serviceName}/vrack/ip`,
      { data: params },
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    postDedicatedNashaServiceVrackIpQueryKey(params),
    fetchData,
  );
};
