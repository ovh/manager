import apiClient from '@ovh-ux/manager-core-api';
import {
  SecretVersion,
  SecretVersionDataField,
  SecretVersionWithData,
} from '@secret-manager/types/secret.type';

export const secretVersionsQueryKeys = {
  list: (okmsId: string, path: string) => ['secret', okmsId, path, 'versions'],
  detailWithData: (okmsId: string, path: string, versionId: number) => [
    'secret',
    okmsId,
    path,
    'versions',
    versionId,
  ],
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

// CREATE version
export type CreateSecretVersionBody = SecretVersionDataField;
export type CreateSecretVersionResponse = SecretVersion;

export type CreateSecretVersionParams = {
  okmsId: string;
  path: string;
  data: CreateSecretVersionBody;
};

export const createSecretVersion = async ({
  okmsId,
  path,
  data,
}: CreateSecretVersionParams) => {
  const { data: response } = await apiClient.v2.post<
    CreateSecretVersionResponse
  >(`okms/resource/${okmsId}/secret/${encodeURIComponent(path)}/version`, {
    data,
  });
  return response;
};

// UPDATE version
export type UpdateSecretVersionBody = SecretVersion['state'];
export type UpdateSecretVersionResponse = SecretVersion;

export type UpdateSecretVersionParams = {
  okmsId: string;
  path: string;
  version: number;
  state: UpdateSecretVersionBody;
};

export const updateSecretVersion = async ({
  okmsId,
  path,
  version,
  state,
}: UpdateSecretVersionParams) => {
  const { data: response } = await apiClient.v2.put<
    UpdateSecretVersionResponse
  >(
    `okms/resource/${okmsId}/secret/${encodeURIComponent(
      path,
    )}/version/${version}`,
    {
      state,
    },
  );
  return response;
};
