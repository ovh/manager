import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { aliasesMock } from '@/data/api';
import { useAlias } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useAlias', () => {
  it('should return the detail of an alias', async () => {
    const { result } = renderHook(
      () =>
        useAlias({
          aliasId: aliasesMock[0].id,
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(aliasesMock[0]);
  });
});
