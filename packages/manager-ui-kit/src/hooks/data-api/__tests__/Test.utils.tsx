import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';

export const getWrapper = () => {
  const queryClient = new QueryClient();

  return ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
export const getFilter = (
  key: string,
  searchTerm: string,
  comparator: FilterComparator,
  type: FilterTypeCategories,
  label = '',
) => ({
  key,
  value: searchTerm,
  comparator,
  type,
  label,
});

export const getSorting = (field: string, descendingOrder: boolean) => ({
  id: field,
  desc: Boolean(descendingOrder),
});
