export type ListingItemType = {
  id: string;
  name?: string;
  status?: string;
};

export type ListingDataResultType<T extends ListingItemType> = {
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
  status: number;
  totalCount: number;
};
