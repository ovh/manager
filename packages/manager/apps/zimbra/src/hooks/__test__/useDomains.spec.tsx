import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { platformMock, organizationDetailMock, domainMock } from '@/api/_mock_';
import { useDomains } from '../useDomains';

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
  const apiGetDomains = vi.fn(() => Promise.resolve({ data: domainMock }));
  return {
    getZimbraPlatformDomains: apiGetDomains,
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Domains', () => {
  it('Return domain list', async () => {
    const { result } = renderHook(() => useDomains(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(domainMock);
  });
});
