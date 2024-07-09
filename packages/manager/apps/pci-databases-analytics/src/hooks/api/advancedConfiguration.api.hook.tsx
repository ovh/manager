import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
} from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import {
  UpdateAdvancedConfigurationProps,
  getAdvancedConfiguration,
  getAdvancedConfigurationCapabilities,
  updateAdvancedConfiguration,
} from '@/data/api/databases/advancedConfiguration';
import { CdbError } from '@/data/api/databases';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

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
  return useQueryImmediateRefetch({
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
  return useQueryImmediateRefetch({
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
