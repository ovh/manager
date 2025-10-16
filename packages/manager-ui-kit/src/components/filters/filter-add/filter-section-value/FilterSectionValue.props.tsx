import { ColumnFilter } from '../FilterAdd.props';

export type FilterSectionValueProps = {
  selectedColumn: ColumnFilter;
  value: string;
  setValue: (value: string) => void;
  submitAddFilter: () => void;
  selectedId: string;
  dateValue: Date | null;
  setDateValue: (dateValue: Date | null) => void;
};
