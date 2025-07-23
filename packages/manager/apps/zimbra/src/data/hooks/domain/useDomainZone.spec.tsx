import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { domainZone } from '@/data/api';
import { useDomainZone } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useDomainZone', () => {
  it('should return a domain zone list', async () => {
    const { result } = renderHook(() => useDomainZone({ name: 'test' }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(domainZone);
  });
});
