import { renderHook, waitFor } from '@testing-library/react';
import { TCatalog, useCatalog } from '@ovh-ux/manager-pci-common';
import { vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { useGetAddons } from './useAddons';
import { wrapper } from '@/wrapperRenders';

describe('useGetAddons', () => {
  it('should return empty data when catalog is undefined', async () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: undefined,
      isPending: false,
    } as UseQueryResult<TCatalog>);

    const { result } = renderHook(() => useGetAddons(), { wrapper });
    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data).toEqual([]);
  });

  it('should return sorted addons when catalog has addons', () => {
    const mockCatalog = {
      addons: [
        {
          planCode: 'octavia-loadbalancer.loadbalancer-s.hour.consumption',
          pricings: [{ price: 10 }],
          blobs: { technical: { name: 'small-addon' } },
        },
        {
          planCode: 'octavia-loadbalancer.loadbalancer-m.hour.consumption',
          pricings: [{ price: 20 }],
          blobs: { technical: { name: 'medium-addon' } },
        },
        {
          planCode: 'octavia-loadbalancer.loadbalancer-l.hour.consumption',
          pricings: [{ price: 30 }],
          blobs: { technical: { name: 'large-addon' } },
        },
      ],
    };
    vi.mocked(useCatalog).mockReturnValue({
      data: mockCatalog,
      isPending: false,
    } as UseQueryResult<TCatalog>);

    const { result } = renderHook(() => useGetAddons());

    expect(result.current.data).toEqual([
      { code: 's', price: 10, label: 'S', technicalName: 'small-addon' },
      { code: 'm', price: 20, label: 'M', technicalName: 'medium-addon' },
      { code: 'l', price: 30, label: 'L', technicalName: 'large-addon' },
    ]);
    expect(result.current.isPending).toBe(false);
  });

  it('should return isPending as true when catalog is loading', () => {
    vi.mocked(useCatalog).mockReturnValue({
      data: undefined,
      isPending: true,
    } as UseQueryResult<TCatalog>);

    const { result } = renderHook(() => useGetAddons());

    expect(result.current.data).toEqual([]);
    expect(result.current.isPending).toBe(true);
  });

  it('should filter out addons that do not match the regex', async () => {
    const mockCatalog = {
      addons: [
        {
          planCode: 'octavia-loadbalancer.loadbalancer-s.hour.consumption',
          pricings: [{ price: 10 }],
          blobs: { technical: { name: 'small-addon' } },
        },
        {
          planCode: 'some-other-plan-code',
          pricings: [{ price: 15 }],
          blobs: { technical: { name: 'other-addon' } },
        },
      ],
    };
    vi.mocked(useCatalog).mockReturnValue({
      data: mockCatalog,
      isPending: false,
    } as UseQueryResult<TCatalog>);

    const { result } = renderHook(() => useGetAddons());

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data).toEqual([
      { code: 's', price: 10, label: 'S', technicalName: 'small-addon' },
    ]);
    expect(result.current.isPending).toBe(false);
  });
});
