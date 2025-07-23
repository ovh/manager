import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { domainsMock } from '@/data/api';
import { useDomains } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useDomains', () => {
  it('should return a domain list', async () => {
    const { result } = renderHook(() => useDomains(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(domainsMock);
  });
});
