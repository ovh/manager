import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { accountsMock } from '@/api/_mock_';
import { useAccountList } from '@/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useAccountList', () => {
  it('should return a list of accounts', async () => {
    const { result } = renderHook(() => useAccountList(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(accountsMock);
  });
});
