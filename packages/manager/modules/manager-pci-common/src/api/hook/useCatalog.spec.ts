import { renderHook, waitFor } from '@testing-library/react';
import { IMe, useMe } from '@ovh-ux/manager-react-components';
import { describe, it, vi } from 'vitest';
import { getCatalog, TCatalog } from '../data/catalog';
import { useCatalog } from './useCatalog';
import { wrapper } from '@/wrapperRenders';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useMe: vi.fn(),
}));

vi.mock('../data/catalog', () => ({
  getCatalog: vi.fn(),
}));

describe('useCatalog', () => {
  it('returns catalog data successfully', async () => {
    const mockData = [
      {
        id: 'catalog1',
        name: 'Catalog 1',
        items: [
          {
            id: 'item1',
            name: 'Item 1',
            price: 10,
          },
        ],
      },
    ];
    vi.mocked(useMe).mockReturnValue({ me: { ovhSubsidiary: 'FR' } as IMe });
    vi.mocked(getCatalog).mockResolvedValueOnce(
      (mockData as unknown) as TCatalog,
    );
    const { result } = renderHook(() => useCatalog(), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(useMe).mockReturnValue({ me: { ovhSubsidiary: 'FR' } as IMe });
    vi.mocked(getCatalog).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useCatalog(), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe(errorMessage);
  });
});
