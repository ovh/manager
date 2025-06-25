import apiClient from '@ovh-ux/manager-core-api';
import {
  Secret,
  SecretMetadata,
  SecretVersionDataField,
} from '@secret-manager/types/secret.type';

// LIST Secret
export const secretListQueryKey = (okmsId: string) => [
  'secrets',
  'list',
  okmsId,
];

export const getSecretList = async (okmsId: string) => {
  const { data } = await apiClient.v2.get<Secret[]>(
    `okms/resource/${okmsId}/secret`,
  );
  return data;
};

// POST Secret
export type CreateSecretBody = {
  path: string;
  metadata?: Pick<
    SecretMetadata,
    'casRequired' | 'customMetadata' | 'deactivateVersionAfter' | 'maxVersions'
  >;
  version: SecretVersionDataField;
};
export type CreateSecretResponse = Pick<Secret, 'path' | 'metadata'>;

export type PostSecretProps = {
  okmsId: string;
  data: CreateSecretBody;
};

export const postSecretMutationKey = () => ['secrets', 'create'];

export const postSecret = async ({
  okmsId,
  data: postData,
}: PostSecretProps) => {
  const { data } = await apiClient.v2.post<CreateSecretResponse>(
    `okms/resource/${okmsId}/secret`,
    postData,
  );
  return data;
};

// PUT Secret
export type UpdateSecretBody = {
  metadata?: Pick<
    SecretMetadata,
    'casRequired' | 'customMetadata' | 'deactivateVersionAfter' | 'maxVersions'
  >;
  version: SecretVersionDataField;
};
export type UpdateSecretResponse = Pick<Secret, 'path' | 'metadata'>;
