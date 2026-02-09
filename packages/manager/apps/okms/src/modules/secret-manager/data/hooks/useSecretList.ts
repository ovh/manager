import { Secret } from '@secret-manager/types/secret.type';

import { useDataApi } from '@ovh-ux/muk';

import { secretQueryKeys } from '@/modules/secret-manager/data/api/secrets';

export const useSecretList = ({ okmsId, pageSize = 25 }: { okmsId: string; pageSize?: number }) => {
  return useDataApi<Secret>({
    iceberg: true,
    enabled: true,
    version: 'v2',
    route: `okms/resource/${okmsId}/secret`,
    cacheKey: secretQueryKeys.list(okmsId),
    pageSize,
  });
};
