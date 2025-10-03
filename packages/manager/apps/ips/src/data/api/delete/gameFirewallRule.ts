import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type DeleteIpGameFirewallRuleParams = {
  ip: string;
  ipOnGame: string;
  ruleId: number;
};

export const deleteIpGameFirewallRule = async ({
  ip,
  ipOnGame,
  ruleId,
}: DeleteIpGameFirewallRuleParams): Promise<ApiResponse<null>> =>
  apiClient.v6.delete<null>(
    `/ip/${encodeURIComponent(ip)}/game/${encodeURIComponent(
      ipOnGame,
    )}/rule/${ruleId}`,
  );
