import { SecretVersion } from '@secret-manager/types/secret.type';

import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';

import { secretVersionsQueryKeys } from '../api/secretVersions';

type UseSecretVersionListParams = {
  okmsId: string;
  path: string;
  pageSize?: number;
  enabled?: boolean;
};

export const useSecretVersionList = ({
  okmsId,
  path,
  pageSize = 25,
  enabled = true,
}: UseSecretVersionListParams) => {
  return useResourcesIcebergV2<SecretVersion>({
    route: `okms/resource/${okmsId}/secret/${encodeURIComponent(path)}/version`,
    queryKey: secretVersionsQueryKeys.list(okmsId, path),
    pageSize,
    enabled,
  });
};
