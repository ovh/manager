import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { mailingListMock } from '@/data/api';
import { useMailingList } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useMailingList', () => {
  it('should return a mailinglist detail', async () => {
    const { result } = renderHook(() => useMailingList({ mailingListId: mailingListMock.id }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mailingListMock);
  });
});
