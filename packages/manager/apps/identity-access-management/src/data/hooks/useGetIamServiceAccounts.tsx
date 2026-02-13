import {
  DatagridColumn,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { IamServiceAccount } from '@/data/api/iam-service-accounts';

export const getIamServiceAccountListQueryKey = () => ['/me/api/oauth2/client'];

const oauthClientsRoute = '/me/api/oauth2/client';
export const useIamServiceAccountList = ({
    columns,
    pageSize,
  }: {
    columns: DatagridColumn<IamServiceAccount>[];
    pageSize: number;
}) => {
  return useResourcesIcebergV6<IamServiceAccount>({
    route: oauthClientsRoute,
    queryKey: getIamServiceAccountListQueryKey(),
    columns,
    pageSize,
  });
};
