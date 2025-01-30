import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type Organisation = {
  city: string;
  country: string;
  abuse_mailbox: string;
  lastname: string;
  zip: string;
  firstname: string;
  address: string;
  registry: 'RIPE' | 'ARIN';
  state: string;
  phone: string;
  organisationId: string;
};

export const getOrganisation = async (
  orgId: string,
): Promise<ApiResponse<Organisation>> =>
  apiClient.v6.get<Organisation>(`/me/ipOrganisation/${orgId}`);
