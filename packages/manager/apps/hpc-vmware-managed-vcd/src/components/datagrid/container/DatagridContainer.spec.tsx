import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DatagridContainer, {
  TDatagridContainerProps,
} from './DatagridContainer.component';

const navigationMock = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => ({
    navigate: navigationMock,
  }),
  useLocation: () => ({
    pathname: '/stublocation',
  }),
}));

vi.mock('@tanstack/react-query', async (reactQuery) => {
  const module = await reactQuery<typeof import('@tanstack/react-query')>();
  return {
    ...module,
    useInfiniteQuery: vi.fn().mockReturnValue({
      data: { pages: [{ data: [{ value: 'value' }] }] },
      isLoading: false,
    }),
  };
});

vi.mock('@ovhcloud/manager-components', async (managerComonents) => {
  const module = await managerComonents<
    typeof import('@ovhcloud/manager-components')
  >();
  return {
    ...module,
    useDatagridSearchParams: vi.fn().mockReturnValue({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      setPagination: vi.fn(),
      sorting: { desc: false, id: 'id' },
      setSorting: vi.fn(),
    }),
  };
});

const renderComponent = (props: TDatagridContainerProps) => {
  const queryClient = new QueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <DatagridContainer {...props} />
    </QueryClientProvider>,
  );
};

describe('DatagridContainer component unit test suite', () => {
  it.each([
    [true, 'pt-0'],
    [false, 'pt-5'],
  ])(
    'should create datagrid container with right css when isEmbedded=%s',
    (isEmbedded, css) => {
      // given
      const props: TDatagridContainerProps = {
        route: {
          api: 'stubapi',
          onboarding: 'onboarding',
        },
        containerId: 'containerId',
        columns: [],
        isEmbedded,
        title: 'my datagrid',
      };

      // when
      const { getByTestId, container, getByText } = renderComponent(props);

      // then
      expect(getByTestId('DatagridContainer--title')).toHaveTextContent(
        props.title,
      );

      // and
      expect(container).toContainHTML(`class="px-10 ${css}"`);

      // and
      expect(getByText('common_pagination_results')).toBeDefined();
    },
  );
});
