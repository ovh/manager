import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { shellContext } from '@/commons/tests-utils/Mock.utils';

export const getWrapper = () => {
  const queryClient = new QueryClient();

  // eslint-disable-next-line react/display-name
  return ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const getWrapperWithShellContext = () => {
  const baseWrapper = getWrapper();

  return ({ children }: React.PropsWithChildren) =>
    baseWrapper({
      children: <ShellContext.Provider value={shellContext}>{children}</ShellContext.Provider>,
    });
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
