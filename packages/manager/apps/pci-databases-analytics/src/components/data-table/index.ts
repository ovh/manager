import { DataTable as Table } from './DataTable.component';
import { DataTableProvider } from './DataTable.context';
import { DatatableAction } from './DatatableAction.component';
import { DatatableFiltersButton } from './DatatableFiltersButton.component';
import { DatatableFiltersList } from './DatatableFiltersList.component';
import { DatatableHeader } from './DatatableHeader.component';
import { DataTablePagination } from './DatatablePagination.component';
import { DatatableSearchBar } from './DatatableSearchBar.component';
import { DatatableSkeleton } from './DatatableSkeleton.component';
import { DatatableSortableHeader } from './DatatableSortableHeader.component';

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
