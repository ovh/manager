import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export const getOrganisationListQueryKey = () => [`get/me/ipOrganisation`];

export const getOrganisationList = async (): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get<string[]>('/me/ipOrganisation');
