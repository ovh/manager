import { v6 } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { ITEMS_PER_PAGE } from '@/constants';
import { getHostingTasks } from '@/data/api/task';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi
      .fn()
      .mockReturnValue({ data: {}, headers: { 'x-pagination-total': '1' } }),
  },
}));

describe('getHostingTasks', () => {
  const serviceName = 'srv-123';

  it('calls v6.get with correct path and pagination headers, returns data and pageParam', async () => {
    const pageParam = { pageNumber: 1, totalPage: 1 };
    await getHostingTasks(serviceName, pageParam);

    expect(v6.get).toHaveBeenCalledWith(
      `/hosting/web/${serviceName}/tasks`,
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
