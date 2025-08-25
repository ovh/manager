import { renderHook } from '@testing-library/react-hooks';
import { describe, expect, it, vi } from 'vitest';

import { ZimbraOffer } from '@/data/api';
import * as hooks from '@/data/hooks';

import { useAccountsStatistics } from './useAccountsStatistics';

vi.mock('@/data/hooks');

describe('useAccountsStatistics', () => {
  const mockUsePlatform = hooks.usePlatform as jest.Mock;
  const mockUseOrganization = hooks.useOrganization as jest.Mock;

  const platformStats = [
    {
      offer: ZimbraOffer.PRO,
      configuredAccountsCount: 2,
      availableAccountsCount: 3,
    },
    {
      offer: ZimbraOffer.STARTER,
      configuredAccountsCount: 1,
      availableAccountsCount: 4,
    },
  ];

  const orgStats = [
    {
      offer: ZimbraOffer.STARTER,
      configuredAccountsCount: 5,
      availableAccountsCount: 1,
    },
  ];

  it('uses platform stats when org is undefined', () => {
    mockUsePlatform.mockReturnValue({
      data: { currentState: { accountsStatistics: platformStats } },
      isLoading: false,
    });

    mockUseOrganization.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    const { result } = renderHook(() => useAccountsStatistics());

    expect(result.current.accountsConfigured).toBe(3);
    expect(result.current.accountsUnconfigured).toBe(7);
    expect(result.current.proCount).toBe(5);
    expect(result.current.starterCount).toBe(5);
    expect(result.current.isLoading).toBe(false);
  });

  it('uses org stats when available', () => {
    mockUsePlatform.mockReturnValue({
      data: { currentState: { accountsStatistics: platformStats } },
      isLoading: false,
    });

    mockUseOrganization.mockReturnValue({
      data: { currentState: { accountsStatistics: orgStats } },
      isLoading: false,
    });

    const { result } = renderHook(() => useAccountsStatistics());

    expect(result.current.accountsConfigured).toBe(5);
    expect(result.current.accountsUnconfigured).toBe(1);
    expect(result.current.proCount).toBe(0);
    expect(result.current.starterCount).toBe(6);
    expect(result.current.isLoading).toBe(false);
  });

  it('shows loading state if either hook is loading', () => {
    mockUsePlatform.mockReturnValue({
      data: null,
      isLoading: true,
    });

    mockUseOrganization.mockReturnValue({
      data: null,
      isLoading: false,
    });

    const { result } = renderHook(() => useAccountsStatistics());

    expect(result.current.isLoading).toBe(true);
  });
});
