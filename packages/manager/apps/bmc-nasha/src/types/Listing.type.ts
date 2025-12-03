export type ListingDataResultType<T> = {
  items: T[];
  total: number;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage?: () => void;
};
