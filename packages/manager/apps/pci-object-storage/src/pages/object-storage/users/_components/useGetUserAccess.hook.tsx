import { useParams } from 'react-router-dom';
import { useGetUserS3Credentials } from '@/data/hooks/user/useGetUserS3Credentials.hook';

export function useGetUserAccess(userId: number) {
  const { projectId } = useParams();
  const query = useGetUserS3Credentials(projectId, userId);

  const access = query.data?.[0]?.access;

  return {
    ...query,
    access,
  };
}
