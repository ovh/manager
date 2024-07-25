import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { database } from '@/models/database';
import {
  UpdateServiceProps,
  addService,
  deleteService,
  getService,
  getServices,
  updateService,
} from '@/api/databases/service';
import { CdbError, ServiceData } from '@/api/databases';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

export function useGetService(
  projectId: string,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/service', serviceId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getService({ projectId, serviceId }),
    ...options,
  }) as UseQueryResult<database.Service, CdbError>;
}

export function useGetServices(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/service'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServices({ projectId }),
    ...options,
  }) as UseQueryResult<database.Service[], Error>;
}

interface MutateServiceProps {
  onError: (cause: CdbError) => void;
  onSuccess: (service: database.Service) => void;
}
export interface ServiceCreationWithEngine extends database.ServiceCreation {
  engine: database.EngineEnum;
}
export function useAddService({ onError, onSuccess }: MutateServiceProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (serviceAndEngine: ServiceCreationWithEngine) => {
      const { engine, ...serviceInfo } = serviceAndEngine;
      return addService({ projectId, engine, serviceInfo });
    },
    onError,
    onSuccess: (data) => {
      // invalidate services list to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'database/service'],
        refetchType: 'none',
      });
      onSuccess(data);
    },
  });

  return {
    addService: (serviceAndEngine: ServiceCreationWithEngine) => {
      return mutation.mutate(serviceAndEngine);
    },
    ...mutation,
  };
}

export function useUpdateService({ onError, onSuccess }: MutateServiceProps) {
  const mutation = useMutation({
    mutationFn: (serviceUpdate: UpdateServiceProps) =>
      updateService(serviceUpdate),
    onError,
    onSuccess,
  });

  return {
    updateService: (serviceAndEngine: UpdateServiceProps) => {
      return mutation.mutate(serviceAndEngine);
    },
    ...mutation,
  };
}

interface UseDeleteServiceProps {
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export function useDeleteService({
  onError,
  onSuccess,
}: UseDeleteServiceProps) {
  const mutation = useMutation({
    mutationFn: (serviceInfo: ServiceData) => {
      return deleteService(serviceInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteService: (serviceInfo: ServiceData) => {
      return mutation.mutate(serviceInfo);
    },
    ...mutation,
  };
}
