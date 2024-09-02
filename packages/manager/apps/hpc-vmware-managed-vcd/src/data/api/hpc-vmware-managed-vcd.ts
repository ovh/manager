import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import IVcdOrganization, {
  IVcdOrganizationState,
} from '@/types/vcd-organization.interface';
import { VCD_ORGANIZATION_ROUTE } from './hpc-vmware-managed-vcd.constants';

export type GetVcdOrganizationListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export type UpdateVcdOrganizationDetailsParams = {
  id: string;
  details: IVcdOrganizationState;
};

/**
 * VMware on OVHcloud : Get VMware on OVHcloud
 */
export const getVcdOrganization = async (
  id: string,
): Promise<ApiResponse<IVcdOrganization>> =>
  apiClient.v2.get(`${VCD_ORGANIZATION_ROUTE}/${id}`);

/**
 * Edit VCD Organization
 */
export const updateVcdOrganizationDetails = async ({
  id,
  details,
}: UpdateVcdOrganizationDetailsParams): Promise<ApiResponse<
  IVcdOrganization
>> =>
  apiClient.v2.put(`${VCD_ORGANIZATION_ROUTE}/${id}`, {
    targetSpec: details,
  });
