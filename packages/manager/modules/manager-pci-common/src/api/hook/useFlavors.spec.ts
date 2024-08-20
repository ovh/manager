import { renderHook, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { vi, describe, it } from 'vitest';
import { useFlavors, useKubeFlavors, useMergedKubeFlavors } from './useFlavors';
import * as useFlavorsModule from './useFlavors';
import {
  getFlavors,
  getKubeFlavors,
  TCatalog,
  TFlavor,
  TKubeFlavor,
  TProductAvailability,
} from '../data';
import { useCatalog } from './useCatalog';
import * as useCatalogModule from './useCatalog';
import { useProductAvailability } from './useAvailability';
import * as useAvailabilityModule from './useAvailability';
import { wrapper } from '@/wrapperRenders';

vi.mock('../data', () => ({
  getFlavors: vi.fn(),
  getKubeFlavors: vi.fn(),
}));

vi.mock('./useCatalog', () => ({
  useCatalog: vi.fn(),
}));

vi.mock('./useAvailability', () => ({
  useProductAvailability: vi.fn(),
}));

describe('useFlavors', () => {
  it('returns flavors data successfully', async () => {
    const mockData = [
      { name: 'flavor1', type: 'eg', planCodes: { hourly: 'plan1' } },
    ] as TFlavor[];
    vi.mocked(getFlavors).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useFlavors('project1', 'region1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(getFlavors).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useFlavors('project1', 'region1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe(errorMessage);
  });
});

describe('useKubeFlavors', () => {
  it('returns kube flavors data successfully', async () => {
    const mockData = ([
      { name: 'kubeFlavor1', type: 'cpu', planCodes: { hourly: 'plan2' } },
    ] as unknown) as TKubeFlavor[];
    vi.mocked(getKubeFlavors).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useKubeFlavors('project1', 'region1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(getKubeFlavors).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useKubeFlavors('project1', 'region1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe(errorMessage);
  });
});

describe('useMergedKubeFlavors', () => {
  it('returns empty array when data is missing', async () => {
    vi.mocked(getFlavors).mockResolvedValueOnce(null);
    vi.mocked(getKubeFlavors).mockResolvedValueOnce(null);
    vi.mocked(useCatalog).mockReturnValue({
      data: null,
      isPending: false,
    } as UseQueryResult<TCatalog>);
    vi.mocked(useProductAvailability).mockReturnValue({
      data: null,
      isPending: false,
    } as UseQueryResult<TProductAvailability>);

    const { result } = renderHook(
      () => useMergedKubeFlavors('project1', 'region1'),
      {
        wrapper,
      },
    );
    await waitFor(() => !result.current.isPending);
    expect(result.current.mergedFlavors).toEqual([]);
  });
});
