import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';

import { OrgDetails } from '@/data/api/get/organisationsDetails';

export const postorputOrganisations = (
  params: OrgDetails,
  isEditMode: boolean,
): Promise<ApiResponse<{ message: string }>> => {
  const url = `/me/ipOrganisation${isEditMode ? `/${params.organisationId}` : ''}`;
  return apiClient.v6[isEditMode ? 'put' : 'post'](url, {
    ...params,
  });
};
