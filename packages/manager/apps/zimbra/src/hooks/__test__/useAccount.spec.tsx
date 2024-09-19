import { describe, expect, vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { platformMock, accountMock } from '@/api/_mock_';
import { useAccount } from '../useAccount';
import { wrapper } from '@/utils/test.provider';

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

describe('useAccount', () => {
  it('should return the detail of an account', async () => {
    const { result } = renderHook(() => useAccount(accountMock[0].id), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(accountMock[0]);
  });
});
