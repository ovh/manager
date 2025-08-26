import apiClient from '@ovh-ux/manager-core-api';
import {
  Secret,
  SecretWithData,
  SecretMetadata,
  SecretVersionDataField,
} from '@secret-manager/types/secret.type';

export const secretQueryKeys = {
  list: (okmsId: string) => ['secret', okmsId],
  detail: (okmsId: string, secretPath: string) => [
    ...secretQueryKeys.list(okmsId),
    secretPath,
  ],
  detailWithData: (okmsId: string, secretPath: string) => [
    ...secretQueryKeys.detail(okmsId, secretPath),
    'with-data',
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

export const getSecretWithData = async (
  okmsId: string,
  secretPath: string,
): Promise<SecretWithData> => {
  const { data } = await apiClient.v2.get<SecretWithData>(
    `okms/resource/${okmsId}/secret/${encodeURIComponent(
      secretPath,
    )}?includeData=true`,
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

export type CreateSecretParams = {
  okmsId: string;
  data: CreateSecretBody;
};

export const createSecret = async ({
  okmsId,
  data: postData,
}: CreateSecretParams) => {
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
