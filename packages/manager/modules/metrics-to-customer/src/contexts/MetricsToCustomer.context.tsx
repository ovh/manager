import { createContext, useContext, useState } from 'react';

import { ContextProviderProps } from '@/contexts/ContextProvider.type';
import {
  MetricsToCustomerContextType,
  MetricsToCustomerState,
} from '@/contexts/MetricsToCustomer.type';

export const MetricsToCustomerContext = createContext<MetricsToCustomerContextType | undefined>(
  undefined,
);

export const useMetricsToCustomerContext = () => {
  const context = useContext(MetricsToCustomerContext);
  if (!context) {
    throw new Error('useDashboard must be used within a MetricsToCustomerContext');
  }
  return context;
};

export const MetricsToCustomerProvider = ({
  children,
  context,
}: ContextProviderProps<MetricsToCustomerState>) => {
  const {
    resourceName,
    productType,
    resourceURN,
    regions,
    defaultRetention,
    subscriptionUrls,
    enableConfigurationManagement,
  } = context;

  const [state, setState] = useState<MetricsToCustomerState>({
    resourceName,
    productType,
    resourceURN,
    regions,
    defaultRetention,
    subscriptionUrls,
    enableConfigurationManagement,
  });

  return (
    <MetricsToCustomerContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </MetricsToCustomerContext.Provider>
  );
};
