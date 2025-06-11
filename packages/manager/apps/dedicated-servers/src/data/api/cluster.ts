import { apiClient, ApiResponse } from '@ovh-ux/manager-core-api';

export const getClusterQueryKey = ['get/dedicated/cluster'];

/**
 * Operations about the Cluster service : List available clusters
 */
export const getClusters = async (): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get('/dedicated/cluster');
