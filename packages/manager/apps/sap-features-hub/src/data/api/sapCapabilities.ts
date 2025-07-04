import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import { getSapCapabilitiesRoute } from '@/utils/apiRoutes.constants';
import { SapCapabilities } from '@/types/sapCapabilities.type';

export const getSapCapabilities = async (
  serviceName: string,
): Promise<ApiResponse<SapCapabilities>> =>
  v6.get(getSapCapabilitiesRoute(serviceName));
