import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { platformMock, mailingListsMock } from '@/api/_mock_';
import { useMailingLists } from '../useMailingLists';
import { wrapper } from '@/utils/test.provider';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/mailinglist/api', () => {
  const apiGetMailingLists = vi.fn(() => Promise.resolve(mailingListsMock));
  return {
    getZimbraPlatformMailingLists: apiGetMailingLists,
  };
});

vi.mock('react-router-dom', () => {
  return {
    useSearchParams: vi.fn(() => [new URLSearchParams()]),
  };
});

describe('useMailingLists', () => {
  it('should return mailing lists', async () => {
    const { result } = renderHook(() => useMailingLists(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mailingListsMock);
  });
});
