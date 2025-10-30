import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { redirectionsMock } from '@/data/api';
import { useRedirections } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useRedirections', () => {
  it('should return a list of redirections', async () => {
    const { result } = renderHook(() => useRedirections(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(redirectionsMock);
  });
});
