import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { useObservabilityServices } from '@/data/hooks/services/useObservabilityServices';
import { ObservabilityService } from '@/types/observability.type';

interface ObservabilityServiceContextType {
  selectedService: string | undefined;
  setSelectedService: (serviceId: string | undefined) => void;
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
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const { data: services, isLoading, error, isSuccess } = useObservabilityServices();

  const value = useMemo(
    () => ({
      selectedService,
      setSelectedService,
      services,
      isLoading,
      isSuccess,
      error,
    }),
    [selectedService, services, isLoading, isSuccess, error],
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
