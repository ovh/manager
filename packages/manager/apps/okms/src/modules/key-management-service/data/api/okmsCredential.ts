import {
  OkmsCredential,
  OkmsCredentialCreation,
} from '@key-management-service/types/okmsCredential.type';

import apiClient from '@ovh-ux/manager-core-api';

/**
 *  Get okms Credential list
 */

export const getOkmsCredentials = async (okmsId: string): Promise<OkmsCredential[]> => {
  const { data } = await apiClient.v2.get<OkmsCredential[]>(`okms/resource/${okmsId}/credential`);
  return data;
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
}): Promise<OkmsCredential> => {
  const { data } = await apiClient.v2.get<OkmsCredential>(
    `okms/resource/${okmsId}/credential/${credentialId}`,
  );
  return data;
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
  const { data: response } = await apiClient.v2.post<OkmsCredential>(
    `okms/resource/${okmsId}/credential`,
    data,
  );
  return response;
};

export const createOkmsCredentialQueryKey = ({ okmsId }: { okmsId: string }) => [
  `post/okms/resource/${okmsId}/credential/create`,
];

/**
 *  delete okms Credential
 */

export const deleteOkmsCredential = async ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}) => {
  const { data } = await apiClient.v2.delete<OkmsCredential>(
    `okms/resource/${okmsId}/credential/${credentialId}`,
  );
  return data;
};

export const deleteOkmsCredentialQueryKey = ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}) => [`/okms/resource/${okmsId}/credential/${credentialId}`];
