import { v6, aapi } from '@ovh-ux/manager-core-api';
import { NASHA_BASE_API_URL } from '@/constants/nasha.constants';
import type {
  Nasha,
  NashaServiceInfo,
  NashaPartition,
  NashaAccess,
  NashaTask,
  NashaZfsOptions,
  ApiSchema,
  CreatePartitionParams,
  CreateAccessParams,
  UpdatePartitionParams,
} from '@/types/nasha.type';

// ============== NASHA ==============

/**
 * Get list of all NAS-HA services
 */
export const getNashaList = async (): Promise<Nasha[]> => {
  const { data } = await v6.get<Nasha[]>(NASHA_BASE_API_URL, {
    headers: {
      'X-Pagination-Mode': 'CachedObjectList-Pages',
      'X-Pagination-Size': '5000',
    },
  });
  return data;
};

/**
 * Get a single NAS-HA service details
 * Uses AAPI to get aggregated data including 'use' property
 */
export const getNasha = async (serviceName: string): Promise<Nasha> => {
  const { data } = await aapi.get<Nasha>(`${NASHA_BASE_API_URL}/${serviceName}`);
  return data;
};

/**
 * Get service info for a NAS-HA
 */
export const getServiceInfos = async (
  serviceName: string,
): Promise<NashaServiceInfo> => {
  const { data } = await v6.get<NashaServiceInfo>(
    `${NASHA_BASE_API_URL}/${serviceName}/serviceInfos`,
  );
  return data;
};

/**
 * Update NAS-HA settings (e.g., monitored, customName)
 */
export const updateNasha = async (
  serviceName: string,
  params: { monitored?: boolean; customName?: string },
): Promise<void> => {
  await v6.put(`${NASHA_BASE_API_URL}/${serviceName}`, params);
};

/**
 * Get API schema for enums
 */
export const getSchema = async (): Promise<ApiSchema> => {
  const { data } = await v6.get<ApiSchema>(`${NASHA_BASE_API_URL}.json`);
  return data;
};

// ============== PARTITIONS ==============

/**
 * Get all partitions for a NAS-HA
 */
export const getPartitions = async (
  serviceName: string,
): Promise<NashaPartition[]> => {
  const { data } = await v6.get<NashaPartition[]>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition`,
    {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '5000',
      },
    },
  );
  return data;
};

/**
 * Get partitions with aggregated data via AAPI
 */
export const getPartitionsAapi = async (
  serviceName: string,
): Promise<NashaPartition[]> => {
  const { data } = await aapi.get<NashaPartition[]>(
    `${NASHA_BASE_API_URL}/${serviceName}/partitions`,
  );
  return data;
};

/**
 * Get total allocated size of all partitions
 */
export const getPartitionAllocatedSize = async (
  serviceName: string,
): Promise<number> => {
  const partitions = await getPartitions(serviceName);
  return partitions.reduce((acc, partition) => acc + partition.size, 0);
};

/**
 * Get a single partition
 */
export const getPartition = async (
  serviceName: string,
  partitionName: string,
): Promise<NashaPartition> => {
  const { data } = await v6.get<NashaPartition>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}`,
  );
  return data;
};

/**
 * Create a new partition
 */
export const createPartition = async (
  serviceName: string,
  params: CreatePartitionParams,
): Promise<NashaTask> => {
  const { data } = await v6.post<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition`,
    params,
  );
  return data;
};

/**
 * Update a partition
 */
export const updatePartition = async (
  serviceName: string,
  partitionName: string,
  params: UpdatePartitionParams,
): Promise<void> => {
  await v6.put(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}`,
    params,
  );
};

/**
 * Delete a partition
 */
export const deletePartition = async (
  serviceName: string,
  partitionName: string,
): Promise<NashaTask> => {
  const { data } = await v6.delete<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}`,
  );
  return data;
};

// ============== PARTITION ACCESS ==============

/**
 * Get all accesses for a partition
 */
export const getAccesses = async (
  serviceName: string,
  partitionName: string,
): Promise<NashaAccess[]> => {
  const { data } = await v6.get<NashaAccess[]>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/access`,
    {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '5000',
      },
    },
  );
  return data;
};

/**
 * Get authorizable IPs for a partition
 */
export const getAuthorizableIps = async (
  serviceName: string,
  partitionName: string,
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/authorizableIps`,
  );
  return data;
};

/**
 * Get authorizable IP blocks for a partition
 */
export const getAuthorizableBlocks = async (
  serviceName: string,
  partitionName: string,
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/authorizableBlocks`,
  );
  return data;
};

/**
 * Create access for a partition
 */
export const createAccess = async (
  serviceName: string,
  partitionName: string,
  params: CreateAccessParams,
): Promise<NashaTask> => {
  const { data } = await v6.post<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/access`,
    params,
  );
  return data;
};

/**
 * Delete access from a partition
 */
export const deleteAccess = async (
  serviceName: string,
  partitionName: string,
  ip: string,
): Promise<NashaTask> => {
  const { data } = await v6.delete<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/access/${encodeURIComponent(ip)}`,
  );
  return data;
};

// ============== SNAPSHOTS ==============

/**
 * Get snapshot types (frequencies) for a partition
 */
export const getSnapshotTypes = async (
  serviceName: string,
  partitionName: string,
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/snapshot`,
  );
  return data;
};

/**
 * Create a snapshot type (frequency)
 */
export const createSnapshotType = async (
  serviceName: string,
  partitionName: string,
  snapshotType: string,
): Promise<NashaTask> => {
  const { data } = await v6.post<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/snapshot`,
    { snapshotType },
  );
  return data;
};

/**
 * Delete a snapshot type (frequency)
 */
export const deleteSnapshotType = async (
  serviceName: string,
  partitionName: string,
  snapshotType: string,
): Promise<NashaTask> => {
  const { data } = await v6.delete<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/snapshot/${snapshotType}`,
  );
  return data;
};

/**
 * Get custom snapshots for a partition
 */
export const getCustomSnapshots = async (
  serviceName: string,
  partitionName: string,
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/customSnapshot`,
  );
  return data;
};

/**
 * Create a custom snapshot
 */
export const createCustomSnapshot = async (
  serviceName: string,
  partitionName: string,
  name: string,
): Promise<NashaTask> => {
  const { data } = await v6.post<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/customSnapshot`,
    { name },
  );
  return data;
};

/**
 * Delete a custom snapshot
 */
export const deleteCustomSnapshot = async (
  serviceName: string,
  partitionName: string,
  name: string,
): Promise<NashaTask> => {
  const { data } = await v6.delete<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/customSnapshot/${encodeURIComponent(name)}`,
  );
  return data;
};

// ============== ZFS OPTIONS ==============

/**
 * Get ZFS options for a partition
 */
export const getZfsOptions = async (
  serviceName: string,
  partitionName: string,
): Promise<NashaZfsOptions> => {
  const { data } = await v6.get<NashaZfsOptions>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/options`,
  );
  return data;
};

/**
 * Update ZFS options for a partition
 */
export const updateZfsOptions = async (
  serviceName: string,
  partitionName: string,
  options: Partial<NashaZfsOptions> | { templateName: string },
): Promise<NashaTask> => {
  const { data } = await v6.post<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/partition/${partitionName}/options`,
    options,
  );
  return data;
};

// ============== TASKS ==============

/**
 * Get all tasks for a NAS-HA
 */
export const getTasks = async (serviceName: string): Promise<NashaTask[]> => {
  const { data } = await v6.get<NashaTask[]>(
    `${NASHA_BASE_API_URL}/${serviceName}/task`,
    {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '5000',
      },
    },
  );
  return data;
};

/**
 * Get a single task
 */
export const getTask = async (
  serviceName: string,
  taskId: number,
): Promise<NashaTask> => {
  const { data } = await v6.get<NashaTask>(
    `${NASHA_BASE_API_URL}/${serviceName}/task/${taskId}`,
  );
  return data;
};

/**
 * Get tasks filtered by criteria
 */
export const getTasksBy = async (
  serviceName: string,
  params: {
    operation?: string;
    status?: string;
    partitionName?: string;
  },
): Promise<NashaTask[]> => {
  const tasks = await getTasks(serviceName);
  return tasks.filter((task) => {
    if (params.operation && task.operation !== params.operation) return false;
    if (params.status && task.status !== params.status) return false;
    if (params.partitionName && task.partitionName !== params.partitionName)
      return false;
    return true;
  });
};
