import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { render } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { datacentreList } from '@ovh-ux/manager-module-vcd-api';
import DatagridContainer, {
  TDatagridContainerProps,
} from './DatagridContainer.component';

vi.mock('@ovh-ux/manager-react-components', async (managerComonents) => {
  const module = await managerComonents<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...module,
    useInfiniteQuery: vi.fn(),
    useResourcesIcebergV2: vi.fn().mockReturnValue({
      data: {
        pages: [
          {
            data: datacentreList,
            status: 200,
            cursorNext: 'P9/pJ3+99fFh2OXXXXX',
          },
        ],
      },
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      cursorNext: 'P9/pJ3+99fFh2OXXXXX',
      isLoading: false,
      isFetchingNextPage: false,
    }),
  };
});

const renderComponent = (props: TDatagridContainerProps) => {
  // const queryClient = new QueryClient();
  return render(
    // <QueryClientProvider client={queryClient}>
    <DatagridContainer {...props} />,
    // </QueryClientProvider>,
  );
};

describe.skip('DatagridContainer component unit test suite', () => {
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
