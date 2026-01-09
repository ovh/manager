import React, { ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

import { useObservabilityServices } from '@/data/hooks/services/useObservabilityServices.hook';
import { ObservabilityService } from '@/types/observability.type';

interface ObservabilityServiceContextType {
  selectedService: ObservabilityService | undefined;
  setSelectedService: (service: ObservabilityService | undefined) => void;
  services: ObservabilityService[] | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  error: Error | null;
}

const ObservabilityServiceContext = createContext<ObservabilityServiceContextType | undefined>(
  undefined,
);

interface ObservabilityServiceProviderProps {
  children: ReactNode;
}

export const ObservabilityServiceProvider: React.FC<ObservabilityServiceProviderProps> = ({
  children,
}) => {
  const { data: services, isLoading, error, isSuccess } = useObservabilityServices();
  const [selectedServiceState, setSelectedServiceState] = useState<
    ObservabilityService | undefined
  >();
  const [isInitialised, setIsInitialised] = useState(false);

  // Use explicitly selected service, or initialise the first time with first service from query
  const selectedService = isInitialised ? selectedServiceState : services?.[0];

  const setSelectedService = useCallback((service: ObservabilityService | undefined) => {
    setIsInitialised(true);
    setSelectedServiceState(service);
  }, []);

  const value = useMemo(
    () => ({
      selectedService,
      setSelectedService,
      services,
      isLoading,
      isSuccess,
      error,
    }),
    [selectedService, setSelectedService, services, isLoading, isSuccess, error],
  );

  return (
    <ObservabilityServiceContext.Provider value={value}>
      {children}
    </ObservabilityServiceContext.Provider>
  );
};

export const useObservabilityServiceContext = (): ObservabilityServiceContextType => {
  const context = useContext(ObservabilityServiceContext);
  if (context === undefined) {
    throw new Error(
      'useObservabilityServiceContext must be used within an ObservabilityServiceProvider',
    );
  }
  return context;
};
