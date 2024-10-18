import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { mailingListDetailMock } from '@/api/_mock_';
import { useMailingList } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useMailingList', () => {
  it('should return a mailinglist detail', async () => {
    const { result } = renderHook(
      () => useMailingList({ mailingListId: mailingListDetailMock.id }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mailingListDetailMock);
  });
});
