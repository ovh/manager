import { queryOptions } from '@tanstack/react-query';

import { getServiceConsumption } from '@/data/api/services/consumption';
import { useGetAgoraServiceIdOptions } from '@/data/hooks/agoraService/useAgoraServiceIdOptions';

export const useGetServiceConsumptionOptions = () => {
  const getAgoraServiceIdOptions = useGetAgoraServiceIdOptions();

  return (resourceName: string) =>
    queryOptions({
      queryKey: ['services', 'consumption', resourceName],
      queryFn: async () => {
        const serviceIds = await getAgoraServiceIdOptions(resourceName);

        return getServiceConsumption(serviceIds.data[0]!);
      },
    });
};
