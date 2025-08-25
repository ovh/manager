import apiClient from '@ovh-ux/manager-core-api';
import {
  Secret,
  SecretMetadata,
  SecretVersionDataField,
} from '@secret-manager/types/secret.type';

export const secretQueryKeys = {
  list: (okmsId: string) => ['secret', okmsId],
  detail: (okmsId: string, secretPath: string) => [
    ...secretQueryKeys.list(okmsId),
    secretPath,
  ],
};

// GET Secret
export const getSecret = async (
  okmsId: string,
  secretPath: string,
): Promise<Secret> => {
  const { data } = await apiClient.v2.get<Secret>(
    `okms/resource/${okmsId}/secret/${encodeURIComponent(secretPath)}`,
  );
  return data;
};

// LIST Secret
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

export type PostSecretParams = {
  okmsId: string;
  data: CreateSecretBody;
};

export const createSecret = async ({
  okmsId,
  data: postData,
}: PostSecretParams) => {
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
