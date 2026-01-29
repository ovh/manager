import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { generateVideoCenterToken, getServiceVideoCenter } from '@/data/api/videoCenter';
import { tokenPayload } from '@/data/types/product/videoManagerCenter/publicService';

export const useVideoCenter = (serviceId: string) => {
  return useQuery({
    queryKey: ['get', 'videocenter', 'resource', serviceId],
    queryFn: () => getServiceVideoCenter(serviceId),
  });
};

export const useGenerateVideoCenterToken = (serviceId: string) => {
  const mutation = useMutation<string, ApiError, tokenPayload>({
    mutationFn: (payload) => generateVideoCenterToken(serviceId, payload),
  });

  return {
    generateVideoCenterToken: mutation.mutate,
    generateVideoCenterTokenAsync: mutation.mutateAsync,
    ...mutation,
  };
};
