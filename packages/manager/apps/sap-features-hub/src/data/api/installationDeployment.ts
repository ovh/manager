import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

const getApplicationVersionRoute = (serviceName: string) =>
  `/dedicatedCloud/${serviceName}/sap/capabilities`;

export const getApplicationVersions = async (
  serviceName: string,
): Promise<ApiResponse<unknown>> =>
  v6.get(getApplicationVersionRoute(serviceName));
