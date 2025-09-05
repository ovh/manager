import { apiClient } from '@ovh-ux/manager-core-api';
import { SecretConfig } from '@secret-manager/types/secret.type';

export const secretConfigOkmsQueryKey = (okmsId: string) => [
  'secret',
  okmsId,
  'config',
];

// GET Secret Config
export const getSecretConfigOkms = async (
  okmsId: string,
): Promise<SecretConfig> => {
  const { data } = await apiClient.v2.get<SecretConfig>(
    `okms/resource/${okmsId}/secretConfig`,
  );
  return data;
};

// PUT secret config
export type SecretConfigBody = Partial<SecretConfig>;
export type SecretConfigResponse = SecretConfig;
