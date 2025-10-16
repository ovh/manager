import {
  Filter,
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';

export type Option = {
  label: string;
  value: string;
};

export type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
  type?: FilterTypeCategories;
  options?: Option[];
};

export type FilterAddProps = {
  columns: ColumnFilter[];
  resourceType?: string;
  onAddFilter: (filter: Filter, column: ColumnFilter) => void;
};
