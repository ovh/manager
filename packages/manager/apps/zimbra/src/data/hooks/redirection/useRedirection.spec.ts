import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { redirectionsMock } from '@/data/api';
import { useRedirection } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useRedirection', () => {
  it('should return the detail of an redirection', async () => {
    const { result } = renderHook(
      () =>
        useRedirection({
          redirectionId: redirectionsMock[0].id,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(redirectionsMock[0]);
  });
});
