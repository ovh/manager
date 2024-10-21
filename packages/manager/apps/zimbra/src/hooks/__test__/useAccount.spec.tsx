import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { accountDetailMock } from '@/api/_mock_';
import { useAccount } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useAccount', () => {
  it('should return the detail of an account', async () => {
    const { result } = renderHook(
      () => useAccount({ accountId: accountDetailMock.id }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(accountDetailMock);
  });
});
