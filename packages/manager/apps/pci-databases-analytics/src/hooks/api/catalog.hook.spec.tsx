import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as API from '@/api/catalog';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import { mockedCatalog } from '@/__tests__/helpers/mocks/catalog';
import { mockedUser } from '@/__tests__/helpers/mocks/user';

vi.mock('@/api/catalog', () => ({
  catalogApi: {
    getCatalog: vi.fn(),
  },
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => {
  return {
    useShell: vi.fn(() => ({
      environment: {
        getEnvironment: vi.fn(() => ({
          getUser: vi.fn(() => mockedUser),
        })),
      },
    })),
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
