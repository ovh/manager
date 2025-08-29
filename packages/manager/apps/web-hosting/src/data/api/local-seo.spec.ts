import { v6 } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { ITEMS_PER_PAGE } from '@/constants';
import {
  getHostingLocalSeo,
  hostingDeleteLocation,
  hostingLocalSeoLogin,
} from '@/data/api/local-seo';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi
      .fn()
      .mockReturnValue({ data: {}, headers: { 'x-pagination-total': '1' } }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('getHostingLocalSeo', () => {
  const serviceName = 'srv-123';

  it('calls v6.get with correct path and pagination headers, returns data and pageParam', async () => {
    const pageParam = { pageNumber: 1, totalPage: 1 };
    await getHostingLocalSeo(serviceName, pageParam);

    expect(v6.get).toHaveBeenCalledWith(
      `/hosting/web/${serviceName}/localSeo/location`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': ITEMS_PER_PAGE,
          'X-Pagination-Number': pageParam.pageNumber,
        }),
      }),
    );
  });
});

describe('hostingLocalSeoLogin', () => {
  it('should call v6.post with the correct URL', async () => {
    const serviceName = 'srv-123';
    const accountId = 'accountId-123';

    await hostingLocalSeoLogin(serviceName, accountId);

    expect(v6.post).toHaveBeenCalledWith(
      `/hosting/web/${serviceName}/localSeo/account/${accountId}/login`,
    );
  });
});

describe('hostingDeleteLocation', () => {
  it('should call v6.post with the correct URL', async () => {
    const serviceName = 'srv-123';
    const locationId = 'locationId-123';

    await hostingDeleteLocation(serviceName, locationId);

    expect(v6.post).toHaveBeenCalledWith(
      `/hosting/web/${serviceName}/localSeo/location/${locationId}/terminate`,
    );
  });
});
