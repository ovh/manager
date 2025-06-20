import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type PutIpGameFirewallParams = {
  ip: string;
  ipOnGame: string;
  firewallModeEnabled?: boolean;
};

export const putIpGameFirewall = async (
  params: PutIpGameFirewallParams,
): Promise<ApiResponse<null>> =>
  apiClient.v6.put(
    `/ip/${encodeURIComponent(params.ip)}/game/${encodeURIComponent(
      params.ipOnGame,
    )}`,
    {
      firewallModeEnabled: params.firewallModeEnabled,
    },
  );
