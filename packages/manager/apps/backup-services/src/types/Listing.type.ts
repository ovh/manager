export type ListingItemType = {
  id: string;
  name?: string;
  status?: string;
};

export type ListingDataResultType<T> = {
  items: T[];
  total: number;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage?: () => void;
};

export type DefaultListingItemType = ListingItemType & {
  name?: string;
  status?: string;
};

export type ListingItemPageType<T extends ListingItemType> = {
  data: T[];
  status?: number;
  totalCount: number;
};

export type ListingPageResult<T> = {
  data: T[];
  totalCount: number;
  cursorNext?: string;
  status?: number;
};
