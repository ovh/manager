import { SecretVersionWithData } from '@secret-manager/types/secret.type';
import { skipToken, useQuery } from '@tanstack/react-query';

import { ErrorResponse } from '@/common/types/api.type';

import { getSecretVersionWithData, secretVersionsQueryKeys } from '../api/secretVersions';

type UseSecretVersionWithDataParams = {
  okmsId: string;
  secretPath: string;
  version: number | undefined;
};

export const useSecretVersionWithData = ({
  okmsId,
  secretPath,
  version,
}: UseSecretVersionWithDataParams) => {
  return useQuery<SecretVersionWithData, ErrorResponse>({
    queryKey: secretVersionsQueryKeys.detailWithData(okmsId, secretPath, version ?? 0),
    queryFn:
      version !== undefined
        ? () => getSecretVersionWithData(okmsId, secretPath, version)
        : skipToken,
    // to remove secret data from cache, clear query instantly when we're done with it
    gcTime: 0,
  });
};
