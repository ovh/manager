import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

export const getUpgradedBandwidth = (): Promise<ApiResponse<string[]>> =>
  v6.get('/order/upgrade/bandwidthVrack');

export const getUpgradedBandwidthServiceId = (
  upgradedBandwidthService: string,
): Promise<ApiResponse<number[]>> =>
  v6.get(`/services?resourceName=${encodeURIComponent(upgradedBandwidthService)}`);
