import type { FilterComparator, FilterTypeCategories } from '@ovh-ux/manager-core-api';

import { FilterOption } from '@/components/filters/Filter.props';

export type ColumnFilter = {
  id: string;
  label: string;
  comparators: FilterComparator[];
  type?: FilterTypeCategories;
  options?: FilterOption[];
};

export interface FilterPayload {
  key: string;
  comparator: FilterComparator;
  value: string;
  type?: FilterTypeCategories;
  tagKey?: string;
}

export interface FilterAddProps {
  columns: ColumnFilter[];
  resourceType?: string;
  onAddFilter: (filter: FilterPayload, column: ColumnFilter) => void;
}
