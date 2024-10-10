import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { platformMock, organizationListMock } from '@/api/_mock_';
import { useOrganizationList } from '../useOrganizationsList';

vi.mock('@/hooks', () => {
  return {
    usePlatform: vi.fn(() => ({
      platformId: platformMock[0].id,
    })),
  };
});

vi.mock('@/api/organization/api', () => {
  const apiOrganization = vi.fn(() =>
    Promise.resolve({ data: organizationListMock }),
  );
  return {
    getZimbraPlatformOrganization: apiOrganization,
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('OrganizationList', () => {
  it('Return list of organization', async () => {
    const { result } = renderHook(() => useOrganizationList(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(organizationListMock);
  });
});
