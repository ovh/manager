import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VCDOrganization, VCDOrganizationTargetSpec } from '../types';
import { getVcdOrganizationRoute } from '../utils/apiRoutes';

type UpdateVcdOrganizationDetailsParams = {
  id: string;
  details: VCDOrganizationTargetSpec;
};

export const getVcdOrganization = async (
  organizationId: string,
): Promise<ApiResponse<VCDOrganization>> =>
  apiClient.v2.get(getVcdOrganizationRoute(organizationId));

export const updateVcdOrganizationDetails = async ({
  id,
  details,
}: UpdateVcdOrganizationDetailsParams): Promise<ApiResponse<VCDOrganization>> =>
  apiClient.v2.put(getVcdOrganizationRoute(id), {
    targetSpec: details,
  });
