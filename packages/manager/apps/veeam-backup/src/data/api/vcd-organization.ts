import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VCDOrganization } from '../vcd.type';

export const organizationApiRoute = '/vmwareCloudDirector/organization';

export const getVcdOrganization = async (
  organizationId: string,
): Promise<ApiResponse<VCDOrganization>> =>
  apiClient.v2.get(`${organizationApiRoute}/${organizationId}`);
