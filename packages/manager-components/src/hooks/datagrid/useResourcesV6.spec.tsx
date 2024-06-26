import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useResourcesV6 } from './useResourcesV6';

/* eslint-disable @typescript-eslint/no-var-requires */
const mockUseQuery = require('@tanstack/react-query').useQuery;

const renderUseResourcesV6Hook = () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => (
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

  const { result } = renderHook(
    () =>
      useResourcesV6({
        columns,
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
  data: [...Array(26).keys()].map((_, i) => ({
    name: `ns5007027.ip-51-${i}-XXXXX5.net`,
  })),
  status: 200,
  totalCount: 26,
};

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

describe('useResourcesV6', () => {
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

  it('should return flattenData with 10 items, 10 items by cursor', async () => {
    const result: any = renderUseResourcesV6Hook();
    const { flattenData } = result.current;
    expect(flattenData?.length).toEqual(10);
  });

  it('should return hasNextPage with true, it rests 16 items to display', async () => {
    const result: any = renderUseResourcesV6Hook();
    const { hasNextPage } = result.current;
    expect(hasNextPage).toBeTruthy();
  });

  it('should return pageIndex with 0 at the launch of the hook', async () => {
    const result: any = renderUseResourcesV6Hook();
    const { pageIndex } = result.current;
    expect(pageIndex).toEqual(0);
  });

  it('should return totalCount with 26', async () => {
    const result: any = renderUseResourcesV6Hook();
    const { totalCount } = result.current;
    expect(totalCount).toEqual(26);
  });
});
