import type { Filter } from '@ovh-ux/manager-core-api';
import { FilterComparator } from '@ovh-ux/manager-core-api';

export type FilterWithLabel = Filter & { label: string; displayValue?: string };

export type ColumnFilterProps = {
  comparator: FilterComparator;
  key: string;
  label: string;
  value: string | string[];
};

export interface FilterProps {
  add: (filters: ColumnFilterProps) => void;
  filters: FilterWithLabel[];
  remove: (filter: FilterWithLabel) => void;
}

export type TagsFilterFormProps = {
  setTagKey: (tagKey: string) => void;
};

export type FilterOption = {
  label: string;
  value: string;
};
