import { getToken } from '@/data/api/database/token.api';

export const getTokenQueryOptions = (projectId: string, name: string) => ({
  queryKey: ['tokens', projectId, name],
  queryFn: () => getToken({ projectId, name }),
  enabled: !!projectId,
});
