import { DataTable as Table } from './DataTable';
import { DataTableProvider } from './DataTableContext';
import DatatableAction from './DatatableAction';
import DatatableFiltersButton from './DatatableFiltersButton';
import { DatatableFiltersList } from './DatatableFiltersList';
import { DatatableHeader } from './DatatableHeader';
import { DataTablePagination } from './DatatablePagination';
import DatatableSearchBar from './DatatableSearchBar';
import { DatatableSkeleton } from './DatatableSkeleton';
import { DatatableSortableHeader } from './DatatableSortableHeader';

const DataTable = {
  Provider: DataTableProvider,
  Header: DatatableHeader,
  Action: DatatableAction,
  SearchBar: DatatableSearchBar,
  FiltersButton: DatatableFiltersButton,
  FiltersList: DatatableFiltersList,
  Table,
  Pagination: DataTablePagination,
  Skeleton: DatatableSkeleton,
  SortableHeader: DatatableSortableHeader,
};

export default DataTable;
