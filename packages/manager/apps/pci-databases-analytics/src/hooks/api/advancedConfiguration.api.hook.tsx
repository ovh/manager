import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import {
  UpdateAdvancedConfigurationProps,
  getAdvancedConfiguration,
  getAdvancedConfigurationCapabilities,
  updateAdvancedConfiguration,
} from '@/api/databases/advancedConfiguration';
import { CdbError } from '@/api/databases';

export function useGetAdvancedConfiguration(
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
    'advancedConfiguration',
  ];
  return useQuery({
    queryKey,
    queryFn: () => getAdvancedConfiguration({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<Record<string, string>, CdbError>;
}

export function useGetAdvancedConfigurationCapabilities(
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
    'capabilities/advancedConfiguration',
  ];
  return useQuery({
    queryKey,
    queryFn: () =>
      getAdvancedConfigurationCapabilities({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<
    database.capabilities.advancedConfiguration.Property[],
    CdbError
  >;
}

interface MutateAdvancedConfigurationProps {
  onError: (cause: CdbError) => void;
  onSuccess: (advancedConfiguration: Record<string, string>) => void;
}
export function useUpdateAdvancedConfiguration({
  onError,
  onSuccess,
}: MutateAdvancedConfigurationProps) {
  const mutation = useMutation({
    mutationFn: (advancedConfiguration: UpdateAdvancedConfigurationProps) => {
      return updateAdvancedConfiguration(advancedConfiguration);
    },
    onError,
    onSuccess,
  });

  return {
    updateAdvancedConfiguration: (
      advancedConfiguration: UpdateAdvancedConfigurationProps,
    ) => {
      return mutation.mutate(advancedConfiguration);
    },
    ...mutation,
  };
}
