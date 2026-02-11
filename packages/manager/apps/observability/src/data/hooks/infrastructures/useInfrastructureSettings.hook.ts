import { useMemo } from 'react';

import { InfraStructureExtraSettings } from '@/types/infrastructures.type';

import { useInfrastructures } from './useInfrastructures.hook';

type UseInfrastructureSettingsResult = {
  data: InfraStructureExtraSettings | undefined;
  isLoading: boolean;
  error: Error | null;
  isError: boolean;
  isSuccess: boolean;
};

export const useInfrastructureSettings = (
  resourceName: string,
  infrastructureId: string,
): UseInfrastructureSettingsResult => {
  const {
    data: infrastructures,
    isLoading,
    error,
    isError,
    isSuccess,
  } = useInfrastructures({
    resourceName,
  });

  const extraSettings = useMemo<InfraStructureExtraSettings | undefined>(() => {
    if (!infrastructures) {
      return undefined;
    }

    const infrastructure = infrastructures.find(({ id }) => id === infrastructureId);
    return infrastructure?.currentState.extraSettings;
  }, [infrastructures, infrastructureId]);

  return {
    data: extraSettings,
    isLoading,
    error,
    isError,
    isSuccess,
  };
};
