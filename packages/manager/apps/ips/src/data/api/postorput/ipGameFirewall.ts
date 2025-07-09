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

export type PostIpGameFirewallParams = {
  ip: string;
  ipOnGame: string;
  startPort: number;
  endPort: number;
  protocol: string;
};

export const addIpGameFirewallRule = async (
  params: PostIpGameFirewallParams,
): Promise<ApiResponse<null>> =>
  apiClient.v6.post(
    `/ip/${encodeURIComponent(params.ip)}/game/${encodeURIComponent(
      params.ipOnGame,
    )}/rule`,
    {
      ports: {
        from: params.startPort,
        to: params.endPort,
      },
      protocol: params.protocol,
    },
  );
