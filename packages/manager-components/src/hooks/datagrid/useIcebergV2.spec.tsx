import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useResourcesIcebergV2 } from './useIcebergV2';

/* eslint-disable @typescript-eslint/no-var-requires */
const mockUseQuery = require('@tanstack/react-query').useInfiniteQuery;

const renderUseIcebergV2Hook = () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => (
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

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useInfiniteQuery: jest.fn(),
  };
});

describe('useIcebergV2', () => {
  beforeEach(() => {
    mockUseQuery.mockImplementation(() => ({
      data: mockData,
      error: null,
      isLoading: false,
      hasNextPage: true,
      staleTime: 3000,
      retry: false,
    }));
  });

  it('should return flattenData with 10 items', async () => {
    const result: any = renderUseIcebergV2Hook();
    const { flattenData } = result.current;
    expect(flattenData?.length).toEqual(10);
  });

  it('should return hasNextPage with true', async () => {
    const result: any = renderUseIcebergV2Hook();
    const { hasNextPage } = result.current;
    expect(hasNextPage).toBeTruthy();
  });
});
