import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type ChangeIpOrganisationParams = {
  ip: string;
  organisation: string;
};

export const changeIpOrganisationQueryKey = (
  params: ChangeIpOrganisationParams,
) => [`post/ip/${encodeURIComponent(params.ip)}/changeOrg`];

export const changeIpOrganisation = async (
  params: ChangeIpOrganisationParams,
): Promise<ApiResponse<void>> => {
  return apiClient.v6.post<void>(
    `/ip/${encodeURIComponent(params.ip)}/changeOrg`,
    {
      organisation: params.organisation,
    },
  );
};
