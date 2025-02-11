import { useServiceDetailsQueryOption } from '@ovh-ux/manager-module-common-api';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo } from 'react';

export type BillingInformationContextParams = {
  resourceName: string;
};

export const BillingInformationContext =
  createContext<BillingInformationContextParams>(null);

export const useBillingInformationContextServiceDetails = () => {
  const { resourceName } = useContext(BillingInformationContext);

  const serviceDetailsOptions = useServiceDetailsQueryOption({ resourceName });
  const {
    data,
    isLoading: isServiceDetailsLoading,
    ...rest
  } = useQuery({
    ...serviceDetailsOptions,
    select: (response) => response.data,
  });

  const isLoading = useMemo(
    () => isServiceDetailsLoading || !resourceName,
    [isServiceDetailsLoading, resourceName],
  );

  return { data, isLoading, ...rest };
};
