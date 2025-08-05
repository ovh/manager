import { UseQueryResult } from '@tanstack/react-query';
import { render, waitFor } from '@testing-library/react';
import { describe, vi } from 'vitest';

import * as osdsComponents from '@ovhcloud/ods-components/react';

import * as pciCommonModule from '@ovh-ux/manager-pci-common';
import { TProject } from '@ovh-ux/manager-pci-common';
import { ResponseAPIError } from '@ovh-ux/manager-pci-public-ip-app/src/interface';
import * as managerComponentsModule from '@ovh-ux/manager-react-components';

import { TWorkflow, usePaginatedWorkflows } from '@/api/hooks/workflows';
import { DEFAULT_DATA } from '@/pages/list/data.mock';
import { wrapper } from '@/wrapperRenders';

import ListingPage from './List.page';

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...actual,
    ChangelogButton: vi.fn().mockReturnValue(<div></div>),
    PciGuidesHeader: vi.fn().mockReturnValue(<div></div>),
    useProjectUrl: vi.fn(() => 'project_url'),
    Notifications: vi.fn().mockReturnValue(<div data-testid="notifications"></div>),
  };
});

vi.mock('@/api/hooks/workflows');

vi.mocked(usePaginatedWorkflows).mockReturnValue(DEFAULT_DATA.emptyPaginatedWorkflows);

describe('ListPage', () => {
  vi.mock('@ovhcloud/ods-components/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@ovhcloud/ods-components/react')>();
    return {
      ...actual,
      OsdsBreadcrumb: vi
        .fn()
        .mockImplementation((props) => <div data-testid="breadcrumb">{JSON.stringify(props)}</div>),
    };
  });

  describe('RedirectionGuard', () => {
    beforeAll(() => {
      vi.mocked(usePaginatedWorkflows).mockReturnValue(DEFAULT_DATA.emptyPaginatedWorkflows);
      vi.spyOn(managerComponentsModule, 'RedirectionGuard').mockImplementation((props) => (
        <div data-testid="guard">
          {JSON.stringify({
            condition: props.condition,
            route: props.route,
            isLoading: props.isLoading,
          })}
        </div>
      ));
    });

    it('should be rendered with right props', async () => {
      const { getByTestId } = render(<ListingPage />, { wrapper });
      await waitFor(() => {
        const props = JSON.parse(getByTestId('guard').textContent) as Record<string, unknown>;
        expect(props.condition).toBe(
          DEFAULT_DATA.emptyPaginatedWorkflows.data.totalRows === 0 &&
            !DEFAULT_DATA.emptyPaginatedWorkflows.isPending,
        );
        expect(props.isLoading).toBe(DEFAULT_DATA.emptyPaginatedWorkflows.isPending);
        expect(props.route).toBe(
          `/pci/projects/${DEFAULT_DATA.project.project_id}/workflow/onboarding`,
        );
      });
    });
  });

  describe('Content', () => {
    beforeAll(() => {
      vi.spyOn(managerComponentsModule, 'RedirectionGuard').mockImplementation((props) => (
        <>{props.children}</>
      ));

      vi.spyOn(pciCommonModule, 'useProject').mockImplementation(
        () =>
          ({
            data: DEFAULT_DATA.project,
            isPending: false,
          }) as UseQueryResult<TProject, ResponseAPIError>,
      );

      vi.spyOn(osdsComponents, 'OsdsBreadcrumb').mockImplementation((props) => (
        <div data-testid="breadcrumb">{JSON.stringify(props)}</div>
      ));

      vi.mocked(usePaginatedWorkflows).mockReturnValue(
        DEFAULT_DATA.fullPaginationWorkflows as ReturnType<typeof usePaginatedWorkflows>,
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
        const props = JSON.parse(getByTestId('breadcrumb').textContent) as Record<string, unknown>;
        expect(props.items).toEqual([
          {
            href: 'project_url',
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
        vi.mocked(usePaginatedWorkflows).mockReturnValue({
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
        vi.mocked(usePaginatedWorkflows).mockReturnValue({
          isPending: false,
          data: {
            rows: [DEFAULT_DATA.workflow as TWorkflow],
            totalRows: 1,
            pageCount: 1,
          },
        });
        vi.spyOn(managerComponentsModule, 'Datagrid').mockImplementation((props) => (
          <div data-testid="grid">{JSON.stringify(props)}</div>
        ));

        const { getByTestId } = render(<ListingPage />, { wrapper });

        await waitFor(() => {
          const el = getByTestId('grid');
          const props = JSON.parse(el.textContent) as Record<string, unknown>;

          expect(Object.keys(props).sort()).toEqual(
            ['columns', 'items', 'totalItems', 'pagination', 'className'].sort(),
          );
          expect(props.items).toEqual([DEFAULT_DATA.workflow]);
          expect(props.totalItems).toEqual(1);
        });
      });
    });
  });
});
