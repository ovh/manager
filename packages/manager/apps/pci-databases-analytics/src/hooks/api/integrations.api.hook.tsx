import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import {
  AddIntegrationProps,
  DeleteIntegrationProps,
  addIntegration,
  deleteIntegration,
  getServiceCapabilitiesIntegrations,
  getServiceIntegrations,
} from '@/data/api/databases/integrations';
import { CdbError } from '@/data/api/databases';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

export function useGetIntegrations(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'integration'];
  return useQueryImmediateRefetch({
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
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getServiceCapabilitiesIntegrations({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.capabilities.Integration[], Error>;
}

interface MutateIntegrationProps {
  onError: (cause: CdbError) => void;
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
  onError: (cause: CdbError) => void;
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
