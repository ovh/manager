import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
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

vi.mock('@ovh-ux/manager-react-components', async (managerComonents) => {
  const module = await managerComonents<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...module,
    useResourcesIcebergV2: vi.fn().mockReturnValue({
      data: { pages: [{ data: [{ id: 'value for id' }] }] },
      isLoading: false,
    }),
    useDatagridSearchParams: vi.fn().mockReturnValue({
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
      setPagination: vi.fn(),
      sorting: { desc: false, id: 'value for id' },
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
        queryKey: ['queryKey'],
        columns: [
          {
            id: 'id',
            cell: ({ id }) => <DataGridTextCell>{id}</DataGridTextCell>,
            label: 'title for id',
          },
        ],
        isEmbedded,
        title: 'my datagrid',
      };

      // when
      const { getByTestId, container, getByText } = renderComponent(props);

      // then
      expect(getByTestId('header-id')).toHaveTextContent('title for id');

      // and
      expect(container).toContainHTML(`class="px-10 ${css}"`);

      // and
      expect(getByText(props.title)).toBeDefined();

      // and
      expect(getByText('value for id')).toBeDefined();
    },
  );
});
