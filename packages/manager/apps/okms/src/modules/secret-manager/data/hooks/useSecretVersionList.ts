import { SecretVersion } from '@secret-manager/types/secret.type';

import { useDataApi } from '@ovh-ux/muk';

import { secretVersionsQueryKeys } from '../api/secretVersions';

type UseSecretVersionListParams = {
  okmsId: string;
  path: string;
  pageSize?: number;
};

export const useSecretVersionList = ({
  okmsId,
  path,
  pageSize = 25,
}: UseSecretVersionListParams) => {
  return useDataApi<SecretVersion>({
    iceberg: true,
    disableCache: true,
    enabled: true,
    version: 'v2',
    route: `okms/resource/${okmsId}/secret/${encodeURIComponent(path)}/version`,
    cacheKey: secretVersionsQueryKeys.list(okmsId, path),
    pageSize,
  });
};
