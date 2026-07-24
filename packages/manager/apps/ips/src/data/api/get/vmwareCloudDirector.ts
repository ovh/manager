import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type VirtualDataCenterCommercialRange = 'NSX' | 'STANDARD' | 'VSAN-NSX';

export type VmwareCloudDirectorResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'OUT_OF_SYNC'
  | 'READY'
  | 'SUSPENDED'
  | 'UNKNOWN'
  | 'UPDATING';

export type VmwareCloudDirectorOrganization = {
  id: string;
  resourceStatus: VmwareCloudDirectorResourceStatus;
  currentState: {
    region: string;
  };
  targetSpec: {
    fullName: string;
  };
};

export type VmwareCloudDirectorVirtualDataCenter = {
  id: string;
  currentState: {
    commercialRange: VirtualDataCenterCommercialRange;
  };
};

export const getVmwareCloudDirectorOrganizationsQueryKey = [
  'get/vmwareCloudDirector/organization',
];

export const getVmwareCloudDirectorOrganizations = (): Promise<
  ApiResponse<VmwareCloudDirectorOrganization[]>
> => apiClient.v2.get('/vmwareCloudDirector/organization');

export const getVmwareCloudDirectorVirtualDataCentersQueryKey = (
  id: string,
) => [`get/vmwareCloudDirector/organization/${id}/virtualDataCenter`];

export const getVmwareCloudDirectorVirtualDataCenters = (
  id: string,
): Promise<ApiResponse<VmwareCloudDirectorVirtualDataCenter[]>> =>
  apiClient.v2.get(`/vmwareCloudDirector/organization/${id}/virtualDataCenter`);
