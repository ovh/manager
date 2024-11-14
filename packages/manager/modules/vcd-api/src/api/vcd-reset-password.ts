import { apiClient, ApiResponse } from '@ovh-ux/manager-core-api';
import { getVcdResetPasswordRoute } from '../utils/apiRoutes';

export const resetOrganizationPassword = (
  id: string,
): Promise<ApiResponse<unknown>> =>
  apiClient.v2.post(getVcdResetPasswordRoute(id));
