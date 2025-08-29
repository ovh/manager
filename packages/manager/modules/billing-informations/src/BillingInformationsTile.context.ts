import { createContext, useContext } from 'react';

import { useQuery } from '@tanstack/react-query';

import { useServiceDetailsQueryOption } from '@ovh-ux/manager-module-common-api';

export type BillingInformationsContextParams = {
  resourceName?: string;
};

export const BillingInformationsTileContext =
  createContext<BillingInformationsContextParams | null>(null);

export const useBillingInformationsContextServiceDetails = () => {
  const context = useContext(BillingInformationsTileContext);

  const { resourceName } = context || {};

  const serviceDetailsOptions = useServiceDetailsQueryOption({ resourceName: resourceName ?? '' });
  const {
    data,
    isLoading: isServiceDetailsLoading,
    ...rest
  } = useQuery({
    ...serviceDetailsOptions,
    select: (response) => response.data,
  });

  const isLoading = isServiceDetailsLoading || !resourceName;

  return { data, isLoading, ...rest };
};
