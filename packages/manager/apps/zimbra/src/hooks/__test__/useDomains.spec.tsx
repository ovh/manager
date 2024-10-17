import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { domainsMock } from '@/api/_mock_';
import { useDomains } from '../useDomains';
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
