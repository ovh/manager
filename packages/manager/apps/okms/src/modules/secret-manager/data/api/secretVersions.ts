import apiClient from '@ovh-ux/manager-core-api';
import {
  SecretVersion,
  SecretVersionDataField,
  SecretVersionWithData,
} from '@secret-manager/types/secret.type';

export const getSecretVersionsQueryKeys = {
  list: (okmsId: string, path: string) => ['secret', okmsId, path, 'versions'],
  detailWithData: (okmsId: string, path: string, versionId: number) => [
    'secret',
    okmsId,
    path,
    'versions',
    versionId,
  ],
};

// LIST Version
export const getSecretVersions = async (okmsId: string, path: string) => {
  const { data } = await apiClient.v2.get<SecretVersion[]>(
    `okms/resource/${okmsId}/secret/${encodeURIComponent(path)}/version`,
  );
  return data;
};

// GET Version

export const getSecretVersionWithData = async (
  okmsId: string,
  path: string,
  versionId: number,
) => {
  const { data } = await apiClient.v2.get<SecretVersionWithData>(
    `okms/resource/${okmsId}/secret/${encodeURIComponent(
      path,
    )}/version/${versionId}?includeData=true`,
  );
  return data;
};

// POST version
export type CreateSecretVersionBody = SecretVersionDataField;
export type CreateSecretVersionResponse = SecretVersionWithData;

// PUT version
export type UpdateSecretVersionBody = Pick<SecretVersion, 'state'>;
export type UpdateSecretVersionResponse = SecretVersion;
