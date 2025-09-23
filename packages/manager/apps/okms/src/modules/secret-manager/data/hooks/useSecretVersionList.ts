import { SecretVersion } from '@secret-manager/types/secret.type';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { secretVersionsQueryKeys } from '../api/secretVersions';

export const useSecretVersionList = ({
  okmsId,
  path,
  pageSize = 25,
}: {
  okmsId: string;
  path: string;
  pageSize?: number;
}) => {
  return useResourcesIcebergV2<SecretVersion>({
    route: `okms/resource/${okmsId}/secret/${encodeURIComponent(path)}/version`,
    queryKey: secretVersionsQueryKeys.list(okmsId, path),
    pageSize,
  });
};
