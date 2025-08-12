import { describe, expect, it, vi } from 'vitest';

import { LISTING_PLACEHOLDER_ITEMS } from '@/App.constants';
import { getListing } from '@/data/api/dashboard-listing/DashboardListing.api';
import type { ListingItemPageType, ListingItemType } from '@/types/Listing.type';

// Mock makeClient to return a fake client with getListing
vi.mock('@/data/api/commons/Client.api', () => ({
  makeClient: () => ({
    getListing: <T extends ListingItemType = ListingItemType>({
      page,
      pageSize,
    }: {
      page: number;
      pageSize: number;
    }): Promise<ListingItemPageType<T>> => {
      const start = (page - 1) * pageSize;
      const data = LISTING_PLACEHOLDER_ITEMS.slice(start, start + pageSize) as T[];
      return Promise.resolve({
        status: 200,
        totalCount: LISTING_PLACEHOLDER_ITEMS.length,
        data,
      });
    },
  }),
}));

describe('getListing (mocked client)', () => {
  it('returns first page slice with status and totalCount', async () => {
    const pageSize = 5;
    const res = await getListing({ page: 1, pageSize });

    expect(res.status).toBe(200);
    expect(res.totalCount).toBe(LISTING_PLACEHOLDER_ITEMS.length);
    expect(res.data).toEqual(LISTING_PLACEHOLDER_ITEMS.slice(0, pageSize));
  });

  it('returns second page slice', async () => {
    const pageSize = 4;
    const res = await getListing<ListingItemType>({ page: 2, pageSize });

    expect(res.data).toEqual(LISTING_PLACEHOLDER_ITEMS.slice(pageSize, pageSize * 2));
  });

  it('returns empty slice if page beyond data', async () => {
    const pageSize = 1000;
    const res = await getListing({ page: 999, pageSize });
    expect(res.data).toEqual([]);
  });
});
