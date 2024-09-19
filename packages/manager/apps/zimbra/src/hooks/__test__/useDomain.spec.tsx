import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { platformMock, domainMock } from '@/api/_mock_';
import { useDomain } from '../useDomain';
import { wrapper } from '@/utils/test.provider';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/domain/api', () => {
  const apiGetDomainDetail = (_platformId: string, id: string) =>
    Promise.resolve(domainMock.find((domain) => domain.id === id));
  return {
    getZimbraPlatformDomainDetail: apiGetDomainDetail,
  };
});

describe('useDomain', () => {
  it('should return the detail of a domain', async () => {
    const domain = domainMock[0];
    const { result } = renderHook(() => useDomain(domain.id), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(domain);
  });
});
