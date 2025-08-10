import { describe, expect, it } from 'vitest';

import { LISTING_PLACEHOLDER_ITEMS } from '@/App.constants';
import type { ListingItemType } from '@/types/Listing.type';

import { getListing } from './DashboardListing.api';

describe('getListing (mocked placeholder)', () => {
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
