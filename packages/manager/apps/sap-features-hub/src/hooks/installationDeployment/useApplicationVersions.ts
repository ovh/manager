import { useQuery } from '@tanstack/react-query';
import { getApplicationVersions } from '@/data/api/installationDeployment';

// TODO: implement API calls when developed
export const useApplicationVersions = (serviceName: string) =>
  useQuery({
    queryKey: ['applicationVersions', serviceName],
    queryFn: () => getApplicationVersions(serviceName),
    select: (res) => res.data,
    enabled: !!serviceName,
  });
