import { SecretConfig } from '@secret-manager/types/secret.type';

import { apiClient } from '@ovh-ux/manager-core-api';

export const secretConfigOkmsQueryKey = (okmsId: string) => ['secret', okmsId, 'config'];

// GET Secret Config
export const getSecretConfigOkms = async (okmsId: string): Promise<SecretConfig> => {
  const { data } = await apiClient.v2.get<SecretConfig>(`okms/resource/${okmsId}/secretConfig`);
  return data;
};

// PUT secret config
export type SecretConfigParams = {
  okmsId: string;
  secretConfig: Partial<SecretConfig>;
};
export type SecretConfigResponse = SecretConfig;

export const updateSecretConfigOkms = async ({ okmsId, secretConfig }: SecretConfigParams) => {
  const { data } = await apiClient.v2.put<SecretConfigResponse>(
    `okms/resource/${okmsId}/secretConfig`,
    secretConfig,
  );
  return data;
};
