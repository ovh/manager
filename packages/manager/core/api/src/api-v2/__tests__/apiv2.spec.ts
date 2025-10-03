import { vi, describe, it, beforeEach, expect } from 'vitest';
import { fetchV2 } from '../apiV2';
import { v2 } from '../../client.js';

vi.mock(import('../../client.js'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    v2: {
      get: vi.fn(),
    },
  };
});

const mockResult = {
  data: [
    {
      name: 'Sample Test Data',
      number: 1,
      bool: false,
    },
  ],
  headers: {
    'x-pagination-cursor-next': 'smaple-cursor-next',
    'x-pagination-elements': '1000',
  },
  status: 'success',
};
const route = '/fetch/v2/endpoint';

describe('apiV2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(v2.get).mockResolvedValue(mockResult);
  });

  it('makes an API call to v2 endpoint', async () => {
    const result = await fetchV2({
      route,
    });
    expect(v2.get).toHaveBeenCalledWith(route, {
      headers: expect.objectContaining({ 'X-Pagination-Size': '10' }),
    });
    expect(result.data).toBe(mockResult.data);
    expect(result.nextCursor).toBe(
      mockResult.headers['x-pagination-cursor-next'],
    );
    expect(result.totalCount).toBe(
      parseInt(mockResult.headers['x-pagination-elements'], 10),
    );
    expect(result.status).toBe(mockResult.status);
  });

  it('makes a v2 call with provided cursor and page-size', async () => {
    const cursor = 'sample-cursor';
    const pageSize = 500;
    await fetchV2({
      route,
      cursor,
      pageSize,
    });
    expect(v2.get).toHaveBeenCalledWith(route, {
      headers: expect.objectContaining({
        'x-pagination-cursor': cursor,
        'X-Pagination-Size': String(pageSize),
      }),
    });
  });

  it('does not return cursor next when its not present in v2 response', async () => {
    const mockResultWithoutCursor = {
      ...mockResult,
      headers: {
        'x-pagination-element': 1000,
      },
    };
    (v2.get as any).mockReturnValue(mockResultWithoutCursor);
    const result = await fetchV2({
      route: '/fetch/v2/endpoint',
    });
    expect(result.nextCursor).not.toBeDefined();
  });
});
