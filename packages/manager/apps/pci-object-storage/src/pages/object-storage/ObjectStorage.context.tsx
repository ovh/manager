import { UseQueryResult } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { UserWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';
import { FormattedStorage, Storages } from '@/types/Storages';
import { useGetStorages } from '@/data/hooks/storage/useGetStorages.hook';
import { useGetUsers } from '@/data/hooks/user/useGetUsers.hook';
import { useGetRegions } from '@/data/hooks/region/useGetRegions.hook';

export type ObjectStorageLayoutContext = {
  storages: FormattedStorage[];
  storagesQuery: UseQueryResult<Storages, Error>;
  users: UserWithS3Credentials[];
};

export const useObjectStorageData = () => {
  const { projectId } = useParams();
  const storagesQuery = useGetStorages(projectId);
  const usersQuery = useGetUsers(projectId);
  const regionQuery = useGetRegions(projectId);

  return {
    projectId,
    storages: storagesQuery.data?.resources,
    usersQuery,
    regions: regionQuery.data,
    storagesQuery,
    users: usersQuery.data,
  };
};
