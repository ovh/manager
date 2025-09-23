import { Secret } from '@secret-manager/types/secret.type';
import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { secretQueryKeys } from '@/modules/secret-manager/data/api/secrets';

export const useSecretList = ({
  okmsId,
  pageSize = 25,
}: {
  okmsId: string;
  pageSize?: number;
}) => {
  return useResourcesIcebergV2<Secret>({
    route: `okms/resource/${okmsId}/secret`,
    queryKey: secretQueryKeys.list(okmsId),
    pageSize,
  });
};
