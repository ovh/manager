import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as API from '@/data/api/catalog/catalog.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { mockedUser } from '@/__tests__/helpers/mocks/user';

vi.mock('@/data/api/catalog/catalog.api', () => ({
  catalogApi: {
    getCatalog: vi.fn(),
  },
}));

vi.mock('@/hooks/useUser', () => {
  return {
    useUser: vi.fn(() => mockedUser),
  };
});

describe('useGetCatalog', () => {
  it('should return OVH Catalog', async () => {
    vi.mocked(API.catalogApi.getCatalog).mockResolvedValue([mockedCatalog]);

    const { result } = renderHook(() => useGetCatalog(), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCatalog]);
      expect(API.catalogApi.getCatalog).toHaveBeenCalled();
    });
  });
});
