import {
  DatagridColumn,
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
import { IamUserToken } from '@/data/api/iam-users';

export const getIamUserTokenListQueryKey = (userId: string) => ['/me/identity/user', userId, 'tokens'];

export const useIamUserTokenList = ({
  userId,
  columns,
  pageSize,
}: {
  userId: string;
  columns: DatagridColumn<IamUserToken>[];
  pageSize: number;
}) => {
  const route = `/me/identity/user/${userId}/token`;
  return useResourcesIcebergV6<IamUserToken>({
    route,
    queryKey: getIamUserTokenListQueryKey(userId),
    columns,
    pageSize,
  });
};
