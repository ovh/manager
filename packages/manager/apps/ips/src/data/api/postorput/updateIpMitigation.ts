import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UpdateIpMitigationParams = {
  ipBlock: string;
  ip: string;
  mitigation: 'PERMANENT' | 'DEFAULT';
};

export const updateIpMitigation = async (
  params: UpdateIpMitigationParams,
): Promise<ApiResponse<void>> => {
  if (params.mitigation === 'PERMANENT') {
    return apiClient.v6.post<void>(
      `/ip/${encodeURIComponent(params.ipBlock)}/mitigation`,
      { ipOnMitigation: params.ip },
    );
  }
  if (params.mitigation === 'DEFAULT') {
    return apiClient.v6.delete<void>(
      `/ip/${encodeURIComponent(params.ipBlock)}/mitigation/${params.ip}`,
    );
  }
  throw new Error('Invalid mitigation type');
};
