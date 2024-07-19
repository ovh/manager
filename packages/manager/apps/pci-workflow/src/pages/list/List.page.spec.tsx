import { render, waitFor } from '@testing-library/react';
import {
  ShellContextType,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { describe, vi } from 'vitest';
import * as managerComponentsModule from '@ovhcloud/manager-components';
import * as osdsComponents from '@ovhcloud/ods-components/react';
import { PublicCloudProject } from '@ovhcloud/manager-components';
import { ResponseAPIError } from '@ovh-ux/manager-pci-public-ip-app/src/interface';
import { DEFAULT_DATA } from '@/pages/list/data.mock';
import * as useWorkflowsModule from '@/api/hooks/workflows';
import ListingPage from './List.page';

const shellContext = {};
const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('ListPage', () => {
  vi.mock('react-router-dom', async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
      ...actual,
      useHref: vi.fn().mockReturnValue(() => ''),
      useParams: vi.fn().mockReturnValue({ projectId: 1 }),
    };
  });

  vi.mock('@ovhcloud/manager-components', async (importOriginal) => {
    const actual = (await importOriginal()) as Record<string, unknown>;
    return {
      ...actual,
      useProject: vi.fn().mockReturnValue({}),
      useProjectUrl: vi.fn().mockReturnValue(''),
      useDatagridSearchParams: vi.fn().mockReturnValue({}),
      PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
      Notifications: vi
        .fn()
        .mockReturnValue(<div data-testid="notifications"></div>),
    };
  });

  vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
    const actual = (await importOriginal()) as Record<any, any>;
    return {
      ...actual,
      OsdsBreadcrumb: vi
        .fn()
        .mockImplementation((props) => (
          <div data-testid="breadcrumb">{JSON.stringify(props)}</div>
        )),
    };
  });

  vi.mock('@/api/hooks/workflows', () => ({
    usePaginatedWorkflows: vi
      .fn()
      .mockReturnValue(DEFAULT_DATA.emptyPaginatedWorkflows),
  }));
  vi.mock('../../core/HidePreloader', () => ({
    default: () => <div data-testid="hide-preloader"></div>,
  }));

  describe('RedirectionGuard', () => {
    beforeAll(() => {
      vi.spyOn(useWorkflowsModule, 'usePaginatedWorkflows').mockReturnValue(
        DEFAULT_DATA.emptyPaginatedWorkflows,
      );
      vi.spyOn(managerComponentsModule, 'RedirectionGuard').mockImplementation(
        (props) => (
          <div data-testid="guard">
            {JSON.stringify({
              condition: props.condition,
              route: props.route,
              isLoading: props.isLoading,
            })}
          </div>
        ),
      );
    });

    it('should be rendered with right props', async () => {
      const { getByTestId } = render(<ListingPage />, { wrapper });
      await waitFor(() => {
        const props = JSON.parse(getByTestId('guard').textContent);
        expect(props.condition).toBe(
          DEFAULT_DATA.emptyPaginatedWorkflows.data.totalRows === 0,
        );
        expect(props.isLoading).toBe(
          DEFAULT_DATA.emptyPaginatedWorkflows.isPending,
        );
        expect(props.route).toBe(
          `/pci/projects/${DEFAULT_DATA.project.project_id}/workflow/onboarding`,
        );
      });
    });
  });

  describe('Content', () => {
    beforeAll(() => {
      vi.spyOn(
        managerComponentsModule,
        'RedirectionGuard',
      ).mockImplementation((props) => <>{props.children}</>);

      vi.spyOn(managerComponentsModule, 'useProject').mockImplementation(
        () =>
          ({
            data: (DEFAULT_DATA.project as unknown) as PublicCloudProject,
            isPending: false,
          } as UseQueryResult<PublicCloudProject, ResponseAPIError>),
      );

      vi.spyOn(osdsComponents, 'OsdsBreadcrumb').mockImplementation((props) => (
        <div data-testid="breadcrumb">{JSON.stringify(props)}</div>
      ));
      vi.spyOn(useWorkflowsModule, 'usePaginatedWorkflows').mockReturnValue(
        DEFAULT_DATA.fullPaginationWorkflows,
      );
    });

    it("should render HidePreloader component if project's data is fetched", async () => {
      const { getByTestId } = render(<ListingPage />, { wrapper });

      await waitFor(() => {
        expect(getByTestId('hide-preloader')).toBeInTheDocument();
      });
    });

    it("should render OsdsBreadcrumb component if project's data is fetched", async () => {
      const { getByTestId } = render(<ListingPage />, { wrapper });

      await waitFor(() => {
        expect(getByTestId('breadcrumb')).toBeInTheDocument();
        const props = JSON.parse(getByTestId('breadcrumb').textContent);
        expect(props.items).toEqual([
          {
            href: '',
          },
          {
            label: 'pci_workflow_title',
          },
        ]);
      });
    });

    it('should render Notifications and Divider', async () => {
      const { getByTestId } = render(<ListingPage />, { wrapper });

      await waitFor(() => {
        expect(getByTestId('notifications')).toBeInTheDocument();
        expect(getByTestId('divider')).toBeInTheDocument();
      });
    });

    it('should render Add button', async () => {
      const { getByTestId } = render(<ListingPage />, { wrapper });

      await waitFor(() => {
        expect(getByTestId('add-button')).toBeInTheDocument();
      });
    });

    it('should render Searchbar', async () => {
      const { getByTestId } = render(<ListingPage />, { wrapper });

      await waitFor(() => {
        expect(getByTestId('search-bar')).toBeInTheDocument();
      });
    });

    describe('Data display', () => {
      it('should show spinner if data is not fetched yet', async () => {
        vi.spyOn(useWorkflowsModule, 'usePaginatedWorkflows').mockReturnValue({
          isPending: true,
          data: {
            rows: undefined,
            totalRows: undefined,
            pageCount: undefined,
          },
        });

        const { getByTestId } = render(<ListingPage />, { wrapper });

        await waitFor(() => {
          expect(getByTestId('spinner')).toBeInTheDocument();
        });
      });

      it('should show data if data is fetched', async () => {
        vi.spyOn(useWorkflowsModule, 'usePaginatedWorkflows').mockReturnValue({
          isPending: false,
          data: {
            rows: [DEFAULT_DATA.workflow],
            totalRows: 1,
            pageCount: 1,
          },
        });
        vi.spyOn(
          managerComponentsModule,
          'Datagrid',
        ).mockImplementation((props) => (
          <div data-testid="grid">{JSON.stringify(props)}</div>
        ));

        vi.spyOn(
          managerComponentsModule,
          'isDiscoveryProject',
        ).mockImplementation(() => false);

        const { getByTestId } = render(<ListingPage />, { wrapper });

        await waitFor(() => {
          const el = getByTestId('grid');
          const props = JSON.parse(el.textContent);

          expect(Object.keys(props).sort()).toEqual(
            ['columns', 'items', 'totalItems', 'className'].sort(),
          );
          expect(props.items).toEqual([DEFAULT_DATA.workflow]);
          expect(props.totalItems).toEqual(1);
        });
      });
    });
  });
});
