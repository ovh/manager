import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { render, waitFor } from '@testing-library/react';
import { describe, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
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

vi.mock('@ovh-ux/manager-react-components', async (managerComponents) => {
  const module = await managerComponents<
    typeof import('@ovh-ux/manager-react-components')
  >();
  return {
    ...module,
    useResourcesIcebergV2: vi.fn().mockReturnValue({
      data: {
        pages: [{ data: [{ id: 'value for id' }] }],
      },
      flattenData: [{ id: 'value for id' }],
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
    ChangelogButton: () => <button>Changelog Button</button>,
    GuideButton: () => <button>Guide Button</button>,
  };
});
const shellContext = {
  shell: {
    environment: {
      getRegion: vi.fn(),

      getEnvironment: () => ({ getUser: () => ({ ovhSubsidiary: 'FR' }) }),
    },
  },
};
const renderComponent = (props: TDatagridContainerProps) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <DatagridContainer {...props} />
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('DatagridContainer component unit test suite', () => {
  it.each([
    [true, 'pt-0'],
    [false, 'pt-5'],
  ])(
    'should create datagrid container with right css when isEmbedded=%s',
    async (isEmbedded, css) => {
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
      const { getByRole, queryAllByText, queryByRole } = renderComponent(props);

      // then
      expect(getByRole('region', { name: props.title })).toHaveAttribute(
        'class',
        `px-10 ${css}`,
      );

      // and
      await waitFor(() =>
        expect(queryAllByText('value for id')[0]).toBeInTheDocument(),
      );

      if (!isEmbedded) {
        expect(getByRole('button', { name: 'Changelog Button' })).toBeVisible();
        expect(getByRole('button', { name: 'Guide Button' })).toBeDefined();
      }

      if (isEmbedded) {
        expect(
          queryByRole('button', {
            name: 'Changelog Button',
          }),
        ).not.toBeInTheDocument();
        expect(
          queryByRole('button', {
            name: 'Guide Button',
          }),
        ).not.toBeInTheDocument();
      }
    },
  );
});
