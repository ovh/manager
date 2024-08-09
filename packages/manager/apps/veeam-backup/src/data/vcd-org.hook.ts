import { apiClient, ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';

export type VCDOrganization = any;

export const useOrganizations = () =>
  useQuery<ApiResponse<VCDOrganization[]>, ApiError>({
    queryKey: ['/vmwareCloudDirector/organization'],
    queryFn: () => apiClient.v2.get(`/vmwareCloudDirector/organization`),
  });

export const getOrganizationDisplayName = (org: VCDOrganization) =>
  org?.currentState?.fullName || org?.currentState?.name;
