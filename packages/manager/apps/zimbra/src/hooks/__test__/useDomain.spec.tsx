import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { domainDetailMock } from '@/api/_mock_';
import { useDomain } from '../useDomain';
import { wrapper } from '@/utils/test.provider';

describe('useDomain', () => {
  it('should return the detail of a domain', async () => {
    const { result } = renderHook(() => useDomain(domainDetailMock.id), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(domainDetailMock);
  });
});
