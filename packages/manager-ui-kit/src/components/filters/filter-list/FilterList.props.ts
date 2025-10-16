import { FilterWithLabel } from '../Filter.props';

export type FilterListProps = {
  filters: FilterWithLabel[];
  onRemoveFilter: (filter: FilterWithLabel) => void;
};
