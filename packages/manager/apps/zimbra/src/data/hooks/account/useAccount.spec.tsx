import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { accountMock } from '@/data/api';
import { useAccount } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useAccount', () => {
  it('should return the detail of an account', async () => {
    const { result } = renderHook(() => useAccount({ accountId: accountMock.id }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(accountMock);
  });
});
