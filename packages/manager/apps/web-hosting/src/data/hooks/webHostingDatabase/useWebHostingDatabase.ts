import { useQuery } from '@tanstack/react-query';

import { getHostingDatabase, getHostingDatabases } from '@/data/api/webHostingDatabase';

export const useGetHostingDatabases = (serviceName?: string, type: string = 'mysql') =>
  useQuery<string[]>({
    queryKey: ['hosting', 'web', serviceName, 'databases', type],
    queryFn: () => getHostingDatabases(serviceName, type),
    enabled: Boolean(serviceName),
  });

export const useGetHostingDatabase = (serviceName?: string, databaseName?: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName, 'database', databaseName],
    queryFn: () => getHostingDatabase(serviceName, databaseName),
    enabled: Boolean(serviceName) && Boolean(databaseName),
  });
