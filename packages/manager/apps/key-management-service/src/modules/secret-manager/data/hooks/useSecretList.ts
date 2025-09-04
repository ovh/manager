import { Secret } from '@secret-manager/types/secret.type';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { secretQueryKeys } from '@/modules/secret-manager/data/api/secrets';

export const useSecretList = ({
  domainId,
  pageSize = 25,
}: {
  domainId: string;
  pageSize?: number;
}) => {
  return useResourcesIcebergV2<Secret>({
    route: `okms/resource/${domainId}/secret`,
    queryKey: secretQueryKeys.list(domainId),
    pageSize,
  });
};
