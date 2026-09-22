import { useQuery } from '@tanstack/react-query';

import { getWebHostingDatabases, getWebHostingDatabasesQueryKey } from '@/data/api/webHosting';

export const useWebHostingDatabases = (serviceName: string, enabled = true) => {
  return useQuery({
    queryKey: getWebHostingDatabasesQueryKey(serviceName),
    queryFn: () => getWebHostingDatabases(serviceName),
    enabled: !!serviceName && enabled,
  });
};
