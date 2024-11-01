import { apiClient, ApiResponse } from '@ovh-ux/manager-core-api';
import { VCD_ORGANIZATION_ROUTE } from './hpc-vmware-managed-vcd.constants';

const getResetPasswordRoute = (id: string) =>
  `${VCD_ORGANIZATION_ROUTE}/${id}/password`;

export const resetOrganizationPassword = (
  id: string,
): Promise<ApiResponse<unknown>> =>
  apiClient.v2.post(getResetPasswordRoute(id));
