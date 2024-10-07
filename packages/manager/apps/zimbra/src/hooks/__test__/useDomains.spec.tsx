import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { platformMock, organizationDetailMock, domainMock } from '@/api/_mock_';
import { useDomains } from '../useDomains';
import { wrapper } from '@/utils/test.provider';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
    useOrganization: vi.fn(() => ({
      data: organizationDetailMock,
    })),
  };
});

vi.mock('@/api/domain/api', () => {
  const apiGetDomains = vi.fn(() => Promise.resolve(domainMock));
  return {
    getZimbraPlatformDomains: apiGetDomains,
  };
});

describe('useDomains', () => {
  it('should return a domain list', async () => {
    const { result } = renderHook(() => useDomains(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(domainMock);
  });
});
