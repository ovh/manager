import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

export const getUpgradedBandwidth = (): Promise<ApiResponse<string[]>> =>
  v6.get('/order/upgrade/bandwidthVrack');
