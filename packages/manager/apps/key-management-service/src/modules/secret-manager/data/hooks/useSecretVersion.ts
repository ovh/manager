import {
  SecretVersion,
  SecretVersionWithData,
} from '@secret-manager/types/secret.type';
import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  getSecretVersionWithData,
  getSecretVersionWithDataQueryKeys,
} from '../api/secretVersions';

export const useSecretVersionWithData = (
  okmsId: string,
  secretPath: string,
  version: number,
) => {
  return useQuery<SecretVersionWithData, ApiError>({
    queryKey: getSecretVersionWithDataQueryKeys(okmsId, secretPath, version),
    queryFn: () => getSecretVersionWithData(okmsId, secretPath, version),
    staleTime: 0,
  });
};
