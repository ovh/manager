import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';

type Task = unknown;
type IpBlock = unknown;
type SnapshotEnum = unknown;

export type DeleteDedicatedNashaServicePartitionPartitionNameParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const deleteDedicatedNashaServicePartitionPartitionNameQueryKey = (
  params: DeleteDedicatedNashaServicePartitionPartitionNameParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}`,
];

/**
 * Storage zpool partition : Delete this partition
 */
export const deleteDedicatedNashaServicePartitionPartitionName = async (
  params: DeleteDedicatedNashaServicePartitionPartitionNameParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.delete(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    deleteDedicatedNashaServicePartitionPartitionNameQueryKey(params),
    fetchData,
  );
};

export type DeleteDedicatedNashaServicePartitionPartitionNameAccessIpParams = {
  /** the ip in root on storage */
  ip?: IpBlock;
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const deleteDedicatedNashaServicePartitionPartitionNameAccessIpQueryKey = (
  params: DeleteDedicatedNashaServicePartitionPartitionNameAccessIpParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/access/${params.ip}`,
];

/**
 * Define Acl for partition : Delete an ACL entry
 */
export const deleteDedicatedNashaServicePartitionPartitionNameAccessIp = async (
  params: DeleteDedicatedNashaServicePartitionPartitionNameAccessIpParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.delete(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/access/${params.ip}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    deleteDedicatedNashaServicePartitionPartitionNameAccessIpQueryKey(params),
    fetchData,
  );
};

export type DeleteDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameParams = {
  /** name of the snapshot */
  name?: string;
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
};

export const deleteDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameQueryKey = (
  params: DeleteDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/customSnapshot/${params.name}`,
];

/**
 * Custom Snapshot : Delete a given snapshot
 */
export const deleteDedicatedNashaServicePartitionPartitionNameCustomSnapshotName = async (
  params: DeleteDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.delete(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/customSnapshot/${params.name}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    deleteDedicatedNashaServicePartitionPartitionNameCustomSnapshotNameQueryKey(
      params,
    ),
    fetchData,
  );
};

export type DeleteDedicatedNashaServicePartitionPartitionNameQuotaUidParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
  /** the uid to set quota on */
  uid?: number;
};

export const deleteDedicatedNashaServicePartitionPartitionNameQuotaUidQueryKey = (
  params: DeleteDedicatedNashaServicePartitionPartitionNameQuotaUidParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/quota/${params.uid}`,
];

/**
 * Partition Quota : Delete a given quota
 */
export const deleteDedicatedNashaServicePartitionPartitionNameQuotaUid = async (
  params: DeleteDedicatedNashaServicePartitionPartitionNameQuotaUidParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.delete(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/quota/${params.uid}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    deleteDedicatedNashaServicePartitionPartitionNameQuotaUidQueryKey(params),
    fetchData,
  );
};

export type DeleteDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeParams = {
  /** the given name of partition */
  partitionName?: string;
  /** The internal name of your storage */
  serviceName?: string;
  /** the interval of snapshot */
  snapshotType?: SnapshotEnum;
};

export const deleteDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeQueryKey = (
  params: DeleteDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeParams,
) => [
  `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/snapshot/${params.snapshotType}`,
];

/**
 * Partition Snapshot : Delete a given snapshot
 */
export const deleteDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotType = async (
  params: DeleteDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.delete(
      `/dedicated/nasha/${params.serviceName}/partition/${params.partitionName}/snapshot/${params.snapshotType}`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    deleteDedicatedNashaServicePartitionPartitionNameSnapshotSnapshotTypeQueryKey(
      params,
    ),
    fetchData,
  );
};

export type DeleteDedicatedNashaServiceVrackParams = {
  /** The internal name of your storage */
  serviceName?: string;
};

export const deleteDedicatedNashaServiceVrackQueryKey = (
  params: DeleteDedicatedNashaServiceVrackParams,
) => [`/dedicated/nasha/${params.serviceName}/vrack`];

/**
 * Partition Vrack : Delete the vrack container
 */
export const deleteDedicatedNashaServiceVrack = async (
  params: DeleteDedicatedNashaServiceVrackParams,
): Promise<Task> => {
  const fetchData = async () => {
    const response = await apiClient.v6.delete(
      `/dedicated/nasha/${params.serviceName}/vrack`,
    );
    return response.data;
  };

  return queryClient.fetchQuery(
    deleteDedicatedNashaServiceVrackQueryKey(params),
    fetchData,
  );
};
