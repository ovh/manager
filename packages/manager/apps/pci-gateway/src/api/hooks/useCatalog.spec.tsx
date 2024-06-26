import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as useMeModule from '@ovhcloud/manager-components';
import { IMe } from '@ovhcloud/manager-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCatalog } from './useCatalog';
import { getCatalog, TCatalog } from '@/api/data/catalog';

vi.mock('@/api/data/catalog', () => ({
  getCatalog: vi.fn().mockResolvedValue({}),
  getCatalogUrl: vi.fn().mockReturnValue('catalogUrl'),
}));

const client = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

describe('useCatalog', () => {
  it('useCatalog returns catalog when user is present', async ({ expect }) => {
    const mockCatalog = ({ id: 'testCatalog' } as unknown) as TCatalog;
    const useMeSpy = vi.spyOn(useMeModule, 'useMe');
    const iMe: IMe = {
      ovhSubsidiary: 'subsidiary',
      currency: {
        code: 'USD',
      },
    };
    useMeSpy.mockReturnValue({ me: iMe });
    vi.mocked(getCatalog).mockResolvedValue(mockCatalog);

    const { result } = renderHook(() => useCatalog(), { wrapper });
    waitFor(() => {
      expect(result.current.data).toEqual(mockCatalog);
    });
  });

  it('useCatalog returns error when fetching catalog fails', async ({
    expect,
  }) => {
    const mockError = new Error('Failed to fetch catalog');
    const useMeSpy = vi.spyOn(useMeModule, 'useMe');

    useMeSpy.mockReturnValue({ me: { ovhSubsidiary: 'subsidiary' } as IMe });
    vi.mocked(getCatalog).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCatalog(), { wrapper });

    waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });
  });
});
