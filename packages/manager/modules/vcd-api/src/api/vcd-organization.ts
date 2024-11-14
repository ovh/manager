import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VCDOrganization } from '../types';

export const organizationApiRoute = '/vmwareCloudDirector/organization';

/**
 * Get one VCD Organization
 */
export const getVcdOrganization = async (
  organizationId: string,
): Promise<ApiResponse<VCDOrganization>> =>
  apiClient.v2.get(`${organizationApiRoute}/${organizationId}`);
