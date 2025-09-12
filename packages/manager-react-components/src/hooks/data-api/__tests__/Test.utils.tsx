import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
import { DatagridColumn } from '../../../components';

export const getWrapper = () => {
  const queryClient = new QueryClient();

  return ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export type ResultObj = {
  name: string;
  number: string;
  bool: string;
};

export const items: ResultObj[] = [
  { name: 'Item 37', number: '37', bool: 'true' },
  { name: 'Item 12', number: '12', bool: 'false' },
  { name: 'Item 45', number: '45', bool: 'true' },
  { name: 'Item 6', number: '6', bool: 'false' },
  { name: 'Item 28', number: '28', bool: 'true' },
  { name: 'Item 1', number: '1', bool: 'false' },
  { name: 'Item 33', number: '33', bool: 'true' },
  { name: 'Item 19', number: '19', bool: 'true' },
  { name: 'Item 50', number: '50', bool: 'false' },
  { name: 'Item 8', number: '8', bool: 'true' },
  { name: 'Item 23', number: '23', bool: 'false' },
  { name: 'Item 41', number: '41', bool: 'true' },
  { name: 'Item 15', number: '15', bool: 'false' },
  { name: 'Item 4', number: '4', bool: 'true' },
  { name: 'Item 31', number: '31', bool: 'false' },
  { name: 'Item 10', number: '10', bool: 'true' },
  { name: 'Item 26', number: '26', bool: 'false' },
  { name: 'Item 39', number: '39', bool: 'true' },
  { name: 'Item 21', number: '21', bool: 'false' },
  { name: 'Item 48', number: '48', bool: 'true' },
  { name: 'Item 17', number: '17', bool: 'false' },
  { name: 'Item 43', number: '43', bool: 'true' },
  { name: 'Item 2', number: '2', bool: 'false' },
  { name: 'Item 34', number: '34', bool: 'true' },
  { name: 'Item 13', number: '13', bool: 'false' },
  { name: 'Item 46', number: '46', bool: 'true' },
  { name: 'Item 7', number: '7', bool: 'false' },
  { name: 'Item 29', number: '29', bool: 'true' },
  { name: 'Item 20', number: '20', bool: 'false' },
  { name: 'Item 49', number: '49', bool: 'true' },
  { name: 'Item 5', number: '5', bool: 'false' },
  { name: 'Item 32', number: '32', bool: 'true' },
  { name: 'Item 11', number: '11', bool: 'false' },
  { name: 'Item 25', number: '25', bool: 'true' },
  { name: 'Item 40', number: '40', bool: 'false' },
  { name: 'Item 16', number: '16', bool: 'true' },
  { name: 'Item 42', number: '42', bool: 'false' },
  { name: 'Item 3', number: '3', bool: 'true' },
  { name: 'Item 36', number: '36', bool: 'false' },
  { name: 'Item 14', number: '14', bool: 'true' },
  { name: 'Item 47', number: '47', bool: 'false' },
  { name: 'Item 9', number: '9', bool: 'true' },
  { name: 'Item 27', number: '27', bool: 'false' },
  { name: 'Item 38', number: '38', bool: 'true' },
  { name: 'Item 22', number: '22', bool: 'false' },
  { name: 'Item 44', number: '44', bool: 'true' },
  { name: 'Item 18', number: '18', bool: 'false' },
  { name: 'Item 35', number: '35', bool: 'true' },
  { name: 'Item 30', number: '30', bool: 'false' },
  { name: 'Item 24', number: '24', bool: 'true' },
];

export const getFilter = (
  key: string,
  searchTerm: string,
  comparator: FilterComparator,
  type: FilterTypeCategories,
  label: string = '',
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

export const columns: DatagridColumn<unknown>[] = [
  {
    id: 'name',
    cell: () => <></>,
    label: 'Name',
    type: FilterTypeCategories.String,
    isSearchable: true,
    isFilterable: true,
  },
  {
    id: 'number',
    cell: () => <></>,
    label: 'Number',
    type: FilterTypeCategories.Numeric,
    isSortable: true,
    isFilterable: true,
  },
  {
    id: 'bool',
    cell: () => <></>,
    label: 'Boolean',
    type: FilterTypeCategories.Boolean,
    isFilterable: true,
  },
];
