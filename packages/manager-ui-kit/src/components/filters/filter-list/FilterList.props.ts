import { FilterWithLabel } from '@/components/filters/Filter.props';

export type FilterListProps = {
  filters: FilterWithLabel[];
  onRemoveFilter: (filter: FilterWithLabel) => void;
};
