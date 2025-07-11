import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import { OrgDetails } from '@/data/api/get/organisationsDetails';

export const postorputOrganisations = (
  params: OrgDetails,
  isEditMode: boolean,
): Promise<ApiResponse<{ message: string }>> => {
  let url = '/me/ipOrganisation';
  if (isEditMode) {
    url = `${url}/${params.organisationId}`;
  }
  return apiClient.v6[isEditMode ? 'put' : 'post'](url, {
    ...params,
  });
};
