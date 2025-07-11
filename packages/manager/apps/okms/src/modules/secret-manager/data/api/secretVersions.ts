import apiClient from '@ovh-ux/manager-core-api';
import {
  SecretVersion,
  SecretVersionDataField,
  SecretVersionWithData,
} from '@secret-manager/types/secret.type';

// LIST Version
export const getSecretVersionsQueryKeys = (okmsId: string, path: string) => [
  'secret',
  'versions',
  okmsId,
  path,
];

export const getSecretVersions = async (okmsId: string, path: string) => {
  const { data } = await apiClient.v2.get<SecretVersion[]>(
    `okms/resource/${okmsId}/secret/${encodeURIComponent(path)}/version`,
  );
  return data;
};

// POST version
export type CreateSecretVersionBody = SecretVersionDataField;
export type CreateSecretVersionResponse = SecretVersionWithData;

// PUT version
export type UpdateSecretVersionBody = Pick<SecretVersion, 'state'>;
export type UpdateSecretVersionResponse = SecretVersion;
