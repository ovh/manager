import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import {
  AddIntegrationProps,
  DeleteIntegrationProps,
  addIntegration,
  deleteIntegration,
  getServiceCapabilitiesIntegrations,
  getServiceIntegrations,
} from '@/api/databases/integrations';

export function useGetIntegrations(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'integration'];
  return useQuery({
    queryKey,
    queryFn: () => getServiceIntegrations({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.Integration[], Error>;
}

export function useGetCapabilitiesIntegrations(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'capabilities/integration',
  ];
  return useQuery({
    queryKey,
    queryFn: () =>
      getServiceCapabilitiesIntegrations({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.capabilities.Integration[], Error>;
}

interface MutateIntegrationProps {
  onError: (cause: Error) => void;
  onSuccess: (database: database.service.Integration) => void;
}
export function useAddIntegration({
  onError,
  onSuccess,
}: MutateIntegrationProps) {
  const mutation = useMutation({
    mutationFn: (integrationInfo: AddIntegrationProps) => {
      return addIntegration(integrationInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addIntegration: (integrationInfo: AddIntegrationProps) => {
      return mutation.mutate(integrationInfo);
    },
    ...mutation,
  };
}

interface UseDeleteIntegrationProps {
  onError: (cause: Error) => void;
  onSuccess: () => void;
}
export function UseDeleteIntegration({
  onError,
  onSuccess,
}: UseDeleteIntegrationProps) {
  const mutation = useMutation({
    mutationFn: (integrationInfo: DeleteIntegrationProps) => {
      return deleteIntegration(integrationInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteIntegration: (integrationInfo: DeleteIntegrationProps) => {
      return mutation.mutate(integrationInfo);
    },
    ...mutation,
  };
}
