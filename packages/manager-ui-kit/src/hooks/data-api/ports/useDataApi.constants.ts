export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_DATA_API_RESPONSE = {
  isLoading: false,
  isError: false,
  error: null,
  isSuccess: false,
  isFetching: false,
  status: 'pending',
  fetchNextPage: () => {},
  hasNextPage: false,
  isFetchingNextPage: false,
  pageIndex: 0,
  totalCount: 0,
  flattenData: [],
};
