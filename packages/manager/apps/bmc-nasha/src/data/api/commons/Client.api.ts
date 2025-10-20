/* eslint-disable @typescript-eslint/no-explicit-any */

import { v6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { NashaService, NashaServiceDetails, NashaOrder, NashaApiResponse, NashaSnapshot, NashaAccess } from '@/types/Nasha.type';

// API endpoints configuration
const API_ENDPOINTS = {
  services: '/dedicated/nasha',
  serviceDetails: (serviceName: string) => `/dedicated/nasha/${serviceName}`,
  serviceInfos: (serviceName: string) => `/dedicated/nasha/${serviceName}/serviceInfos`,
  partitions: (serviceName: string) => `/dedicated/nasha/${serviceName}/partition`,
  partition: (serviceName: string, partitionName: string) =>
    `/dedicated/nasha/${serviceName}/partition/${partitionName}`,
  partitionAccess: (serviceName: string, partitionName: string) =>
    `/dedicated/nasha/${serviceName}/partition/${partitionName}/access`,
  partitionCustomSnapshots: (serviceName: string, partitionName: string) =>
    `/dedicated/nasha/${serviceName}/partition/${partitionName}/customSnapshot`,
  partitionSnapshotPolicies: (serviceName: string, partitionName: string) =>
    `/dedicated/nasha/${serviceName}/partition/${partitionName}/snapshot`,
  partitionZfsOptions: (serviceName: string, partitionName: string) =>
    `/dedicated/nasha/${serviceName}/partition/${partitionName}/zfsOptions`,
  quotas: (serviceName: string) => `/dedicated/nasha/${serviceName}/quota`,
  tasks: (serviceName: string) => `/dedicated/nasha/${serviceName}/task`,
  task: (serviceName: string, taskId: string | number) =>
    `/dedicated/nasha/${serviceName}/task/${taskId}`,
  order: '/order/dedicated/nasha/new',
  datacenters: '/dedicated/nasha/datacenter',
} as const;

// Generic API response handler
const handleApiResponse = <T>(response: any): NashaApiResponse<T> => {
  if (response.status >= 200 && response.status < 300) {
    return {
      data: response.data,
      totalCount: response.headers?.['x-total-count'] ? parseInt(response.headers['x-total-count'], 10) : undefined,
      status: 'success',
    };
  }

  return {
    data: null as T,
    status: 'error',
    message: response.data?.message || 'An error occurred',
  };
};

// Services listing using Iceberg API (same as nasha AngularJS app)
export const getNashaServices = async (params?: {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
}): Promise<NashaApiResponse<NashaService[]>> => {
  try {
    const { page = 1, pageSize = 50, sortBy = 'serviceName', sortDesc = false } = params || {};

    // Use Iceberg API for services listing (same as nasha AngularJS app)
    const response = await fetchIcebergV6({
      route: API_ENDPOINTS.services,
      page,
      pageSize,
      sortBy,
      sortReverse: sortDesc,
    });

    return {
      data: response.data as NashaService[],
      totalCount: response.totalCount,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: [],
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch NAS-HA services',
    };
  }
};

// Service details
export const getNashaServiceDetails = async (serviceName: string): Promise<NashaApiResponse<NashaServiceDetails>> => {
  try {
    const [serviceResponse, partitionsResponse, quotasResponse, serviceInfosResponse] = await Promise.all([
      v6.get(API_ENDPOINTS.serviceDetails(serviceName)),
      v6.get(API_ENDPOINTS.partitions(serviceName)),
      v6.get(API_ENDPOINTS.quotas(serviceName)),
      v6.get(API_ENDPOINTS.serviceInfos(serviceName)),
    ]);

    const serviceDetails: NashaServiceDetails = {
      ...serviceResponse.data,
      partitions: partitionsResponse.data || [],
      quotas: quotasResponse.data || [],
      snapshots: [],
      access: [],
      serviceInfos: serviceInfosResponse?.data,
    };

    return {
      data: serviceDetails,
      status: 'success',
    };
         } catch (error: any) {
           return {
             data: null as any,
             status: 'error',
             message: error.response?.data?.message || 'Failed to fetch service details',
           };
         }
};

// Create new NAS-HA service
export const createNashaService = async (orderData: NashaOrder): Promise<NashaApiResponse<any>> => {
  try {
    const response = await v6.post(API_ENDPOINTS.order, orderData);
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      message: error.response?.data?.message || 'Failed to create NAS-HA service',
    };
  }
};

// Delete NAS-HA service
export const deleteNashaService = async (serviceName: string): Promise<NashaApiResponse<void>> => {
  try {
    await v6.delete(API_ENDPOINTS.serviceDetails(serviceName));
    return {
      data: undefined,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: undefined,
      status: 'error',
      message: error.response?.data?.message || 'Failed to delete NAS-HA service',
    };
  }
};

// Get available datacenters
export const getNashaDatacenters = async (): Promise<NashaApiResponse<string[]>> => {
  try {
    const response = await v6.get(API_ENDPOINTS.datacenters);
    return handleApiResponse<string[]>(response);
  } catch (error: any) {
    return {
      data: [],
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch datacenters',
    };
  }
};

// Update service name
export const updateNashaServiceName = async (
  serviceName: string,
  customName: string
): Promise<NashaApiResponse<void>> => {
  try {
    await v6.put(API_ENDPOINTS.serviceDetails(serviceName), { customName });
    return {
      data: undefined,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: undefined,
      status: 'error',
      message: error.response?.data?.message || 'Failed to update service name',
    };
  }
};

// Partition management - using real NAS-HA API
export const createNashaPartition = async (
  serviceName: string,
  partitionData: {
    partitionName: string;
    size: number;
    protocol: string;
    description?: string;
  }
): Promise<NashaApiResponse<any>> => {
  try {
    const response = await v6.post(API_ENDPOINTS.partitions(serviceName), partitionData);
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      message: error.response?.data?.message || 'Failed to create partition',
    };
  }
};

export const deleteNashaPartition = async (
  serviceName: string,
  partitionName: string
): Promise<NashaApiResponse<void>> => {
  try {
    await v6.delete(`${API_ENDPOINTS.partitions(serviceName)}/${partitionName}`);
    return {
      data: undefined,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: undefined,
      status: 'error',
      message: error.response?.data?.message || 'Failed to delete partition',
    };
  }
};

// Get partition custom snapshots (manual)
export const getNashaPartitionSnapshots = async (
  serviceName: string,
  partitionName: string
): Promise<NashaApiResponse<NashaSnapshot[]>> => {
  try {
    const response = await v6.get(
      API_ENDPOINTS.partitionCustomSnapshots(serviceName, partitionName),
    );
    return handleApiResponse<NashaSnapshot[]>(response);
  } catch (error: any) {
    return {
      data: [],
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch snapshots',
    };
  }
};

// Get partition access rules
export const getNashaPartitionAccess = async (
  serviceName: string,
  partitionName: string
): Promise<NashaApiResponse<NashaAccess[]>> => {
  try {
    const response = await v6.get(
      API_ENDPOINTS.partitionAccess(serviceName, partitionName),
    );
    return handleApiResponse<NashaAccess[]>(response);
  } catch (error: any) {
    return {
      data: [],
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch access rules',
    };
  }
};

// Access management - partition-specific
export const createNashaAccess = async (
  serviceName: string,
  partitionName: string,
  accessData: {
    ip: string;
    type: 'readwrite' | 'readonly';
    description?: string;
  }
): Promise<NashaApiResponse<any>> => {
  try {
    const response = await v6.post(
      API_ENDPOINTS.partitionAccess(serviceName, partitionName),
      accessData,
    );
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      message: error.response?.data?.message || 'Failed to create access',
    };
  }
};

export const deleteNashaAccess = async (
  serviceName: string,
  partitionName: string,
  ip: string
): Promise<NashaApiResponse<void>> => {
  try {
    await v6.delete(
      `${API_ENDPOINTS.partitionAccess(serviceName, partitionName)}/${ip}`,
    );
    return {
      data: undefined,
      status: 'success',
    };
  } catch (error: any) {
    return {
      data: undefined,
      status: 'error',
      message: error.response?.data?.message || 'Failed to delete access',
    };
  }
};

// Create manual custom snapshot
export const createNashaCustomSnapshot = async (
  serviceName: string,
  partitionName: string,
  snapshot: { snapshotName: string; description?: string },
): Promise<NashaApiResponse<any>> => {
  try {
    const response = await v6.post(
      API_ENDPOINTS.partitionCustomSnapshots(serviceName, partitionName),
      snapshot,
    );
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      message: error.response?.data?.message || 'Failed to create snapshot',
    };
  }
};

// Configure automatic snapshots (enable/disable policies)
export const updateNashaSnapshotPolicies = async (
  serviceName: string,
  partitionName: string,
  body: any,
): Promise<NashaApiResponse<any>> => {
  try {
    const response = await v6.post(
      API_ENDPOINTS.partitionSnapshotPolicies(serviceName, partitionName),
      body,
    );
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      message: error.response?.data?.message || 'Failed to update snapshot policies',
    };
  }
};

// Get/Update ZFS options
export const getNashaZfsOptions = async (
  serviceName: string,
  partitionName: string,
): Promise<NashaApiResponse<any>> => {
  try {
    const response = await v6.get(
      API_ENDPOINTS.partitionZfsOptions(serviceName, partitionName),
    );
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch ZFS options',
    };
  }
};

export const updateNashaZfsOptions = async (
  serviceName: string,
  partitionName: string,
  body: any,
): Promise<NashaApiResponse<any>> => {
  try {
    const response = await v6.put(
      API_ENDPOINTS.partitionZfsOptions(serviceName, partitionName),
      body,
    );
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      message: error.response?.data?.message || 'Failed to update ZFS options',
    };
  }
};

// Tasks tracking
export const getNashaTasks = async (
  serviceName: string,
): Promise<NashaApiResponse<any[]>> => {
  try {
    const response = await v6.get(API_ENDPOINTS.tasks(serviceName));
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: [],
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch tasks',
    };
  }
};

export const getNashaTask = async (
  serviceName: string,
  taskId: string | number,
): Promise<NashaApiResponse<any>> => {
  try {
    const response = await v6.get(API_ENDPOINTS.task(serviceName, taskId));
    return handleApiResponse(response);
  } catch (error: any) {
    return {
      data: null,
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch task',
    };
  }
};
