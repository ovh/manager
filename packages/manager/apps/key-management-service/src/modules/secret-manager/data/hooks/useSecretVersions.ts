import { SecretVersion } from '@secret-manager/types/secret.type';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { secretVersionsQueryKeys } from '../api/secretVersions';

export const useSecretVersions = ({
  domainId,
  path,
  pageSize = 25,
}: {
  domainId: string;
  path: string;
  pageSize?: number;
}) => {
  return useResourcesIcebergV2<SecretVersion>({
    route: `okms/resource/${domainId}/secret/${encodeURIComponent(
      path,
    )}/version`,
    queryKey: secretVersionsQueryKeys.list(domainId, path),
    pageSize,
  });
};
