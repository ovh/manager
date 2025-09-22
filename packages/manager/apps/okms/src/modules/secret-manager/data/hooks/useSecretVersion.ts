import { SecretVersionWithData } from '@secret-manager/types/secret.type';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  secretVersionsQueryKeys,
  getSecretVersionWithData,
} from '../api/secretVersions';

export const useSecretVersionWithData = (
  okmsId: string,
  secretPath: string,
  version: number,
) => {
  return useQuery<SecretVersionWithData, ApiError>({
    queryKey: secretVersionsQueryKeys.detailWithData(
      okmsId,
      secretPath,
      version,
    ),
    queryFn: () => getSecretVersionWithData(okmsId, secretPath, version),
    // to remove secret data from cache, clear query instantly when we're done with it
    gcTime: 0,
  });
};
