import { ApiError } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { SecretVersion } from '@secret-manager/types/secret.type';
import {
  getSecretVersions,
  secretVersionsQueryKeys,
} from '../api/secretVersions';

// TODO: use useIcebergV2 when pagination is fixed
export const useSecretVersions = (domainId: string, path: string) => {
  return useQuery<SecretVersion[], ApiError>({
    queryKey: secretVersionsQueryKeys.list(domainId, path),
    queryFn: () => getSecretVersions(domainId, path),
  });
};
