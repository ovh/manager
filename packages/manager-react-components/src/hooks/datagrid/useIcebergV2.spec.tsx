import React from 'react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import { useIcebergV2InfiniteQuery } from './useIcebergV2';
import { defaultPageSize } from '.';

vi.mock('@ovh-ux/manager-core-api', async () => {
  const originalModule = await vi.importActual('@ovh-ux/manager-core-api');
  return {
    ...originalModule,
    fetchIcebergV2: vi.fn(),
  };
});

type MockedDataType = { ip: string; newUpgradeSystem: boolean };

const wrapper = ({ children }: React.PropsWithChildren) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockData = [
  {
    ip: '51.222.xxx.xxx',
    newUpgradeSystem: true,
  },
  {
    ip: '15.235.xxx.xxx',
    newUpgradeSystem: false,
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
    ip: '15.234.xxx.xxx',
    newUpgradeSystem: true,
  },
  {
    ip: '139.99.xxx.xxx',
    newUpgradeSystem: true,
  },
];

vi.mocked(fetchIcebergV2).mockImplementation((params) => {
  const offset = Number(params.cursor) || 0;
  const data = mockData.slice(offset, offset + params.pageSize);
  const cursorNext = offset + data.length;
  return Promise.resolve({
    data,
    status: 200,
    cursorNext: cursorNext < mockData.length ? String(cursorNext) : undefined,
  });
});

describe('useIcebergV2', () => {
  it('should return data with default page size', async () => {
    const { result } = renderHook(
      () =>
        useIcebergV2InfiniteQuery<MockedDataType[]>({
          iceberg: {
            route: 'test',
          },
          query: {
            queryKey: ['test'],
          },
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const { data } = result.current;

    expect(data.length).toEqual(defaultPageSize);
  });

  it('should return a page with set pageSize', async () => {
    const { result } = renderHook(
      () =>
        useIcebergV2InfiniteQuery<MockedDataType[]>({
          iceberg: {
            route: 'test',
            pageSize: 1,
          },
          query: {
            queryKey: ['test'],
          },
        }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const { data, hasNextPage } = result.current;

    expect(data.length).toEqual(1);

    expect(hasNextPage).toBeTruthy();
  });
});
