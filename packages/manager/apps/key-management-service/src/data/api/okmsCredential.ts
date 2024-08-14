/**
 *  Get okms Credential list
 */

import apiClient from '@ovh-ux/manager-core-api';
import { OkmsCredential } from '@/types/okmsCredential.type';

export const getOkmsCredentialList = async (
  okmsId: string,
): Promise<{ data: OkmsCredential[] }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/credential`);
};

export const getOkmsCredentialListQueryKey = (okmsId: string) => [
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
