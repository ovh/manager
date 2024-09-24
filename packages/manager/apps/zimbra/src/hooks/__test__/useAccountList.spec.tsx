import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { platformMock, accountMock } from '@/api/_mock_';
import { useAccountList } from '../useAccountList';
import { wrapper } from '@/utils/test.provider';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/account/api', () => {
  const apiZimbraPlatformAccount = vi.fn(() => Promise.resolve(accountMock));
  return {
    getZimbraPlatformAccounts: apiZimbraPlatformAccount,
  };
});

vi.mock('react-router-dom', () => {
  return {
    useSearchParams: vi.fn(() => [new URLSearchParams()]),
  };
});

describe('useAccountList', () => {
  it('should return a list of accounts', async () => {
    const { result } = renderHook(() => useAccountList(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(accountMock);
  });
});
