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
  const [selectedServiceId, setSelectedServiceId] = useState<string | null | undefined>(undefined);

  // Derive selectedService from services list using the selected ID
  // This ensures the selected service is always up-to-date when the services list is refreshed
  // - undefined: not initialised yet, use first service
  // - null: explicitly cleared
  // - string: find the service by ID
  const selectedService = useMemo(() => {
    if (!services?.length) return undefined;
    if (selectedServiceId === undefined) return services[0];
    if (selectedServiceId === null) return undefined;
    return services.find((service) => service.id === selectedServiceId) ?? services[0];
  }, [services, selectedServiceId]);

  const setSelectedService = useCallback((service: ObservabilityService | undefined) => {
    setSelectedServiceId(service?.id ?? null);
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
