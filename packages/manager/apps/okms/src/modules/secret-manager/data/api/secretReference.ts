import { SecretConfigReference } from '@secret-manager/types/secret.type';

import { apiClient } from '@ovh-ux/manager-core-api';

export const secretReferenceQueryKeys = {
  config: (regionId: string) => ['secret', 'config', 'reference', regionId],
};

export const getSecretConfigReference = async (regionId: string) => {
  const { data } = await apiClient.v2.get<SecretConfigReference>(
    `/okms/reference/secretConfig?region=${regionId}`,
  );
  return data;
};
