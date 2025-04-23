import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VrackSegment } from '../types';
import { getVcdDatacentreVrackNetworkRoute } from '../utils/apiRoutes';

export const getVcdVrackNetwork = async (
  organizationId: string,
  vdcId: string,
): Promise<ApiResponse<VrackSegment[]>> =>
  apiClient.v2.get(getVcdDatacentreVrackNetworkRoute(organizationId, vdcId));
