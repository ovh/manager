import React from 'react';
import { vitest } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useResourcesIcebergV2 } from './useIcebergV2';

vitest.mock('@tanstack/react-query', async () => {
  const originalModule = await vitest.importActual('@tanstack/react-query');
  return {
    ...originalModule,
    useInfiniteQuery: vitest.fn(),
  };
});

const renderUseIcebergV2Hook = () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(
    () =>
      useResourcesIcebergV2({
        route: '/dedicated/nasha',
        queryKey: ['/dedicated/nasha'],
      }),
    {
      wrapper,
    },
  );

  return result;
};

const mockData = {
  pages: [
    {
      data: [
        {
          ip: '51.222.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '15.235.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '148.113.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '148.113.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '148.113.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '51.222.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '51.161.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '148.113.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '15.235.xxx.xxx',
          newUpgradeSystem: true,
        },
        {
          ip: '139.99.xxx.xxx',
          newUpgradeSystem: true,
        },
      ],
      status: 200,
      cursorNext: 'P9/pJ3+99fFh2OXXXXX',
    },
  ],
  pageParams: [null, 2],
};

describe('useIcebergV2', () => {
  beforeEach(() => {
    (useInfiniteQuery as jest.Mock).mockImplementation(() => ({
      data: mockData,
      error: null as unknown,
      isLoading: false,
      hasNextPage: true,
      staleTime: 3000,
      retry: false,
    }));
  });

  it('should return flattenData with 10 items', async () => {
    const result = renderUseIcebergV2Hook();
    const { flattenData } = result.current;
    expect(flattenData?.length).toEqual(10);
  });

  it('should return hasNextPage with true', async () => {
    const result = renderUseIcebergV2Hook();
    const { hasNextPage } = result.current;
    expect(hasNextPage).toBeTruthy();
  });
});
