import type { Filter, FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';

import { FilterOption } from '@/components/filters/Filter.props';

export type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
  type?: FilterTypeCategories;
  options?: FilterOption[];
};

export type FilterAddProps = {
  columns: ColumnFilter[];
  resourceType?: string;
  onAddFilter: (filter: Filter, column: ColumnFilter) => void;
};
