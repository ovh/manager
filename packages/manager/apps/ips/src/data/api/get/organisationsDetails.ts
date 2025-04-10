import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type GetOrganisationsDetailsParams = {
  organisationId: string;
};

export type GetMeModelParams = {
  org: string;
};

export type OrgDetails = {
  abuse_mailbox?: string;
  address?: string;
  city?: string;
  country?: string;
  firstname?: string;
  lastname?: string;
  organisationId?: string;
  phone?: string;
  registry?: string;
  state?: string;
  zip?: string;
};

export const getOrganisationsDetailsQueryKey = (
  params: GetOrganisationsDetailsParams,
) => [`get/me/ipOrganisation/${encodeURIComponent(params.organisationId)}`];

export const getOrganisationsDetails = async (
  params: GetOrganisationsDetailsParams,
): Promise<ApiResponse<OrgDetails>> =>
  apiClient.v6.get<OrgDetails>(
    `/me/ipOrganisation/${encodeURIComponent(params.organisationId)}`,
  );

export const getMeModelQueryKey = () => [`/me.json/`];

export const getMeModel = async () => apiClient.v6.get(`/me.json`);

export const postOrganisations = (
  params: OrgDetails,
  isEditMode: boolean,
): Promise<ApiResponse<{ message: string }>> => {
  if (isEditMode) {
    return apiClient.v6.put(`/me/ipOrganisation`, {
      ...params,
    });
  }
  return apiClient.v6.post(`/me/ipOrganisation`, {
    ...params,
  });
};
