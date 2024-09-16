import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { platformMock, domainMock } from '@/api/_mock_';
import { useDomain } from '../useDomain';

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

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Domains', () => {
  it('should return domain detail', async () => {
    const domain = domainMock[0];
    const { result } = renderHook(() => useDomain(domain.id), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(domain);
  });
});
