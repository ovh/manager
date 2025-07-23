import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { domainMock } from '@/data/api';
import { useDomain } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useDomain', () => {
  it('should return the detail of a domain', async () => {
    const { result } = renderHook(() => useDomain({ domainId: domainMock.id }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(domainMock);
  });
});
