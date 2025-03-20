import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type GetOrganisationsDetailsParams = {
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
) => [`get/me/ipOrganisation/${encodeURIComponent(params.org)}`];

export const getOrganisationsDetails = async (
  params: GetOrganisationsDetailsParams,
): Promise<ApiResponse<OrgDetails>> =>
  apiClient.v6.get<OrgDetails>(
    `/me/ipOrganisation/${encodeURIComponent(params.org)}`,
  );
