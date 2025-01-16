import React from 'react';
import { vitest } from 'vitest';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { IcebergFetchParamsV6 } from '@ovh-ux/manager-core-api';
import { ResourcesV6Hook, useResourcesV6 } from './useResourcesV6';

vitest.mock('@tanstack/react-query', async () => {
  const originalModule = await vitest.importActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: vitest.fn(),
  };
});

const renderUseResourcesV6Hook = (
  hookParams: Partial<IcebergFetchParamsV6 & ResourcesV6Hook> = {},
) => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }: React.PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const columns = [
    {
      id: 'name',
      header: 'name',
      label: 'name',
      accessorKey: 'name',
      type: 'string',
      cell: (props: any) => <div>{props.name}</div>,
    },
  ];

  return renderHook(
    () =>
      useResourcesV6({
        columns,
        route: '/dedicated/nasha',
        queryKey: ['/dedicated/nasha'],
        ...hookParams,
      }),
    {
      wrapper,
    },
  );
};

const mockData = {
  data: [...Array(26).keys()].map((_, i) => ({
    name: `ns5007027.ip-51-${i}-XXXXX5.net`,
  })),
  status: 200,
  totalCount: 26,
};

describe('useResourcesV6', () => {
  beforeEach(() => {
    (useQuery as jest.Mock).mockImplementation(() => ({
      data: mockData,
      error: null,
      isLoading: false,
      hasNextPage: true,
      staleTime: 3000,
      retry: false,
    }));
  });

  it('should return flattenData with 10 items, 10 items by cursor', async () => {
    const { result } = renderUseResourcesV6Hook();
    const { flattenData } = result.current;
    expect(flattenData?.length).toEqual(10);
  });

  it('should return flattenData with 20 items sorted by cursor without dupicated elements', async () => {
    const hook = renderUseResourcesV6Hook();
    act(() => hook.rerender());
    act(() => hook.result.current.setSorting({ desc: false, id: 'name' }));
    act(() => hook.rerender());
    act(() => hook.result.current.fetchNextPage());
    act(() => hook.rerender());
    const { flattenData } = hook.result.current as {
      flattenData: { name: string }[];
    };
    expect(new Set(flattenData.map((data) => data.name)).size).toEqual(
      flattenData.length,
    );
    expect(flattenData.length).toEqual(20);
  });

  it('should return hasNextPage with true, it rests 16 items to display', async () => {
    const { result } = renderUseResourcesV6Hook();
    const { hasNextPage } = result.current;
    expect(hasNextPage).toBeTruthy();
  });

  it('should return pageIndex with 0 at the launch of the hook', async () => {
    const { result } = renderUseResourcesV6Hook();
    const { pageIndex } = result.current;
    expect(pageIndex).toEqual(0);
  });

  it('should return totalCount with 26', async () => {
    const { result } = renderUseResourcesV6Hook();
    const { totalCount } = result.current;
    expect(totalCount).toEqual(26);
  });
});
