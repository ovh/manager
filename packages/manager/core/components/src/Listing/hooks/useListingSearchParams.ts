import useJsonSearchParam from './useJsonSearchParam';
import { ListingColumn, ListingState } from '../Listing';

export function useListingSearchParams<T>() {
  const [initialState, updateState] = useJsonSearchParam<ListingState>('list');
  const [hiddenColumns, updateHiddenColumns] = useJsonSearchParam<string[]>(
    'hidden',
  );

  const isColumnVisible = (key: string) =>
    (hiddenColumns || []).indexOf(key) < 0;

  const isColumnHidden = (key: string) => !isColumnVisible(key);

  const getInitialState = (columns: ListingColumn<T>[]) =>
    initialState || {
      table: {
        currentPage: 1,
        pageSize: 10,
        sort: {
          key: columns[0].key,
        },
      },
      filters: [],
    };

  const updateColumns = (columns: ListingColumn<T>[]) => {
    const hidden = columns.filter((c) => c.hidden).map(({ key }) => key);
    updateHiddenColumns(hidden.length ? hidden : null);
  };

  return {
    getInitialState,
    isColumnVisible,
    isColumnHidden,
    updateColumns,
    updateState,
  };
}

export default useListingSearchParams;
