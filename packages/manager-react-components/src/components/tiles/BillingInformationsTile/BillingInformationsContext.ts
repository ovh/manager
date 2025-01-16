import { useServiceDetails } from '@ovh-ux/manager-module-common-api';
import { createContext, useContext, useMemo } from 'react';

export type BillingInformationContextParams = {
  resourceName: string;
};

export const BillingInformationContext =
  createContext<BillingInformationContextParams>(null);

export const useBillingInformationContextServiceDetails = () => {
  const { resourceName } = useContext(BillingInformationContext);

  const {
    data: serviceDetailsResponse,
    isLoading: isServiceDetailsLoading,
    ...rest
  } = useServiceDetails({
    resourceName,
  });

  const data = useMemo(
    () => serviceDetailsResponse?.data,
    [serviceDetailsResponse],
  );

  const isLoading = useMemo(
    () => isServiceDetailsLoading || !resourceName,
    [isServiceDetailsLoading, resourceName],
  );

  return { data, isLoading, rest };
};
