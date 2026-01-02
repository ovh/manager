import { useQuery } from '@tanstack/react-query';

import { getServiceConsumption } from '@/data/api/services/consumption';
import { useGetBackupServicesId } from '@/data/hooks/backup/useBackupServicesId';

export const useServiceConsumption = (resourceName: string) => {
  const getBackupServiceId = useGetBackupServicesId();

  return useQuery({
    queryKey: ['services', 'consumption', resourceName],
    queryFn: async () => {
      const serviceId = await getBackupServiceId();
      return getServiceConsumption(Number(serviceId));
    },
  });
};
