import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
  useMutation,
} from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { database } from '@/models/database';
import { addService, getService, getServices } from '@/api/databases/service';

export function useGetService(
  projectId: string,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/service', serviceId];
  return useQuery({
    queryKey,
    queryFn: () => getService(projectId, serviceId),
    ...options,
  }) as UseQueryResult<database.Service, Error>;
}

export function useGetServices(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database/service'];
  return useQuery({
    queryKey,
    queryFn: () => getServices(projectId),
    ...options,
  }) as UseQueryResult<database.Service[], Error>;
}

interface AddServiceProps {
  onError: (cause: Error) => void;
  onSuccess: (service: database.Service) => void;
}
export interface ServiceCreationWithEngine extends database.ServiceCreation {
  engine: database.EngineEnum;
}
export function useAddService({ onError, onSuccess }: AddServiceProps) {
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (serviceAndEngine: ServiceCreationWithEngine) => {
      const { engine, ...serviceInfo } = serviceAndEngine;
      return addService(projectId, engine, serviceInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addService: (serviceAndEngine: ServiceCreationWithEngine) => {
      return mutation.mutate(serviceAndEngine);
    },
    ...mutation,
  };
}
