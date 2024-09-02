import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import { OkmsCredential } from '@/types/okmsCredential.type';

/**
 *  Get okms Credential list
 */

export const getOkmsCredentials = async (
  okmsId: string,
): Promise<ApiResponse<OkmsCredential[]>> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/credential`);
};

export const getOkmsCredentialsQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}/credential`,
];

/**
 *  Get okms Credential
 */

export const getOkmsCredentialQueryKey = ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}) => [`get/okms/resource/${okmsId}/credential/${credentialId}`];

export const getOkmsCredential = async ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}): Promise<{ data: OkmsCredential }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/credential/${credentialId}`);
};
