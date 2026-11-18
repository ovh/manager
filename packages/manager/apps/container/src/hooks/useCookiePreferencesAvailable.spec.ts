import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { cmp } from '@/cmp';
import { useCookiePreferencesAvailable } from './useCookiePreferencesAvailable';

vi.mock('@/cmp', () => ({
  cmp: {
    whenReady: vi.fn().mockResolvedValue(undefined),
    isError: vi.fn().mockReturnValue(false),
  },
}));
const mockedCmp = vi.mocked(cmp);

describe('useCookiePreferencesAvailable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCmp.whenReady.mockResolvedValue(undefined);
    mockedCmp.isError.mockReturnValue(false);
  });

  it.each(['EU', 'CA'])(
    'is available in %s once the CMP is up',
    async (region) => {
      const { result } = renderHook(() =>
        useCookiePreferencesAvailable(region),
      );
      expect(result.current).toBe(false);
      await waitFor(() => expect(result.current).toBe(true));
    },
  );

  it('stays unavailable when the CMP failed to come up', async () => {
    mockedCmp.isError.mockReturnValue(true);
    const { result } = renderHook(() => useCookiePreferencesAvailable('EU'));
    await waitFor(() => expect(mockedCmp.isError).toHaveBeenCalled());
    expect(result.current).toBe(false);
  });

  it('never asks the CMP outside EU/CA', () => {
    const { result } = renderHook(() => useCookiePreferencesAvailable('US'));
    expect(result.current).toBe(false);
    expect(mockedCmp.whenReady).not.toHaveBeenCalled();
  });
});
