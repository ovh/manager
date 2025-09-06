import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { accountsMock } from '@/data/api';
import { useAccounts } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useAccounts', () => {
  it('should return a list of accounts', async () => {
    const { result } = renderHook(() => useAccounts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(accountsMock);
  });
});
