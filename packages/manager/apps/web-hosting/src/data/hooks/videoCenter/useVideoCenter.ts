import { useQuery } from '@tanstack/react-query';

import { getServiceVideoCenter } from '@/data/api/videoCenter';

export const useVideoCenter = (serviceId: string) => {
  return useQuery({
    queryKey: ['get', 'videocenter', 'resource', serviceId],
    queryFn: () => getServiceVideoCenter(serviceId),
  });
};
