import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getObservabilityService,
  getObservabilityServiceQueryKey,
  getObservabilityServicesList,
  getObservabilityServicesListQueryKey,
  updateObservabilityService,
} from '@/data/api/obs';
import { ObservabilityResource } from '../types/response';
import { UpdateObservabilityServiceNamePayload } from '../types/UpdateObservabilityServiceNamePayload.type';

export const useObservabilityServices = () => {
  return useQuery<ObservabilityResource[], Error>({
    queryKey: getObservabilityServicesListQueryKey,
    queryFn: getObservabilityServicesList,
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useObservabilityService = (serviceId: string) => {
  return useQuery<ObservabilityResource, Error>({
    queryKey: getObservabilityServiceQueryKey(serviceId),
    queryFn: () => getObservabilityService(serviceId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useUpdateObservabilityServiceName = (serviceId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ObservabilityResource,
    Error,
    UpdateObservabilityServiceNamePayload
  >({
    mutationFn: (payload) => updateObservabilityService(serviceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getObservabilityServiceQueryKey(serviceId),
      });
      queryClient.invalidateQueries({
        queryKey: getObservabilityServicesListQueryKey,
      });
    },
  });
};
