import { v2 } from '../client.js';
import { buildHeaders } from '../utils/headers-builder/headersBuilder.js';
import { FetchV2Params, FetchV2Result } from './apiV2.types.js';

export const fetchV2 = async <TData = unknown>({
  route,
  cursor,
  pageSize = 10,
}: FetchV2Params): Promise<FetchV2Result<TData>> => {
  const requestHeaders = buildHeaders()
    .setCursor(cursor)
    .setPaginationSize(pageSize)
    .build();

  const { data, headers, status } = await v2.get(route, {
    headers: requestHeaders,
  });

  const nextCursor = headers['x-pagination-cursor-next'];
  const totalCount = headers['x-pagination-element'];

  return { data, nextCursor, status, totalCount };
};
