import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  OkmsCredential,
  OkmsCredentialCreation,
} from '@/types/okmsCredential.type';

/**
 *  Get okms Credential list
 */

export const getOkmsCredentials = async (
  okmsId: string,
): Promise<ApiResponse<OkmsCredential[]>> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/credential`);
};

/**
 *  Get okms Credential
 */

export const getOkmsCredential = async ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}): Promise<ApiResponse<OkmsCredential>> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/credential/${credentialId}`);
};

/**
 *  create okms Credential
 */

export const createOkmsCredential = async ({
  okmsId,
  data,
}: {
  okmsId: string;
  data: OkmsCredentialCreation;
}) => {
  return apiClient.v2.post<OkmsCredential>(
    `okms/resource/${okmsId}/credential`,
    data,
  );
};

export const createOkmsCredentialQueryKey = ({
  okmsId,
}: {
  okmsId: string;
}) => [`post/okms/resource/${okmsId}/credential/create`];
