import { describe, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePlatform } from '../usePlatform';
import { platformMock } from '@/api/_mock_';

vi.mock('@/api/platform/api', () => {
  const mock = vi.fn(() => Promise.resolve(platformMock));
  return {
    getZimbraPlatformList: mock,
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Platform', () => {
  it('We have to return the firt element', async () => {
    const { result } = renderHook(() => usePlatform(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(platformMock[0]);
  });
});
