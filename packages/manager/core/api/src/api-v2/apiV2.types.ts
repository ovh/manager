export type FetchV2Params = {
  route: string;
  cursor?: string;
  pageSize?: number;
};

export type FetchV2Result<TData = unknown> = {
  data: TData;
  status: number;
  totalCount?: number;
  nextCursor?: string;
};
