import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { platformMock, accountMock } from '@/api/_mock_';
import { useAccount } from '../useAccount';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/account/api', () => {
  const apiZimbraPlatformAccountDetail = vi.fn(() =>
    Promise.resolve(accountMock[0]),
  );
  return {
    getZimbraPlatformAccountDetail: apiZimbraPlatformAccountDetail,
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Account detail', () => {
  it('Return detail of account', async () => {
    const { result } = renderHook(() => useAccount(accountMock[0].id), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(accountMock[0]);
  });
});
