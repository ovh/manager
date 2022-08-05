import useJsonSearchParam from '@/hooks/useJsonSearchParam';
import { ListingColumn, ListingState } from '@/components/Listing';

export default function useListingSearchParams<T>() {
  const [initialState, updateState] = useJsonSearchParam<ListingState>('list');
  const [hiddenColumns, updateHiddenColumns] = useJsonSearchParam<string[]>(
    'hidden',
  );

  const isColumnVisible = (key: string) =>
    (hiddenColumns || []).indexOf(key) < 0;

  const isColumnHidden = (key: string) => !isColumnVisible(key);

  const getInitialState = () => initialState;

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
