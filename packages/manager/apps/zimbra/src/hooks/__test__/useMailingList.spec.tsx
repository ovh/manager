import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { platformMock, mailingListsMock } from '@/api/_mock_';
import { useMailingList } from '../useMailingList';
import { wrapper } from '@/utils/test.provider';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/mailinglist/api', () => {
  const apiGetMailingListDetail = (_platformId: string, id: string) =>
    Promise.resolve(mailingListsMock.find((ml) => ml.id === id));
  return {
    getZimbraPlatformMailingListDetails: apiGetMailingListDetail,
  };
});

describe('useMailingList', () => {
  it('should return a mailinglist detail', async () => {
    const mailingList = mailingListsMock[0];
    const { result } = renderHook(
      () => useMailingList({ mailingListId: mailingList.id }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mailingList);
  });
});
