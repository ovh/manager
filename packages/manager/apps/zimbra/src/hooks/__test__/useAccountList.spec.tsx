import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { platformMock, accountMock } from '@/api/_mock_';
import { useAccountList } from '../useAccountList';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/account/api', () => {
  const apiZimbraPlatformAccount = vi.fn(() =>
    Promise.resolve({ data: accountMock }),
  );
  return {
    getZimbraPlatformAccounts: apiZimbraPlatformAccount,
  };
});

vi.mock('react-router-dom', () => {
  return {
    useSearchParams: vi.fn(() => [new URLSearchParams()]),
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Account list', () => {
  it('Return list of account', async () => {
    const { result } = renderHook(() => useAccountList(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(accountMock);
  });
});
