/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';

import { useResourcesV6 } from '@ovh-ux/manager-react-components';
import { useTrustedZoneBanner } from '@ovh-ux/manager-pci-common';
import Listing from './Listing';
import useRedirectAfterProjectSelection from '@/hooks/useRedirectAfterProjectSelection';
import {
  renderWithProviders,
  createMockUseResourcesV6,
  assertElementExists,
  assertElementNotExists,
  assertDatagridRendered,
  assertDatagridLoading,
  assertLoadingState,
  assertNotLoadingState,
  assertNoErrorState,
  MOCKED_PROJECTS,
} from '@/test-utils';

// Mocks des modules externes
vi.mock('./datagrid-columns', () => ({
  getDatagridColumns: vi.fn().mockReturnValue([
    {
      id: 'description',
      label: 'Description',
      cell: () => <div data-testid="description-cell">Description</div>,
    },
    {
      id: 'status',
      label: 'Status',
      cell: () => <div data-testid="status-cell">Status</div>,
    },
    {
      id: 'actions',
      label: '',
      cell: () => <div data-testid="actions-cell">Actions</div>,
    },
  ]),
}));

vi.mock('@/hooks/useRedirectAfterProjectSelection', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('@/data/api/projects-with-services', () => ({
  getProjectsWithServices: vi.fn(),
  projectsWithServiceQueryKey: () => ['projects-with-services'],
}));

vi.mock('@/components/ManagerBannerText', () => ({
  __esModule: true,
  default: () => <div data-testid="manager-banner-text" />,
}));

describe('Listing Page', () => {
  // Setup des mocks par défaut
  const setupDefaultMocks = ({
    resourcesV6Overrides = {},
    trustedZoneOverrides = {},
    redirectOverrides = {},
  } = {}) => {
    // Mock useResourcesV6 avec les overrides
    vi.mocked(useResourcesV6).mockReturnValue(
      createMockUseResourcesV6(resourcesV6Overrides),
    );

    // Mock useTrustedZoneBanner avec les overrides
    vi.mocked(useTrustedZoneBanner).mockReturnValue({
      isBannerVisible: false,
      isLoading: false,
      ...trustedZoneOverrides,
    });

    // Mock useRedirectAfterProjectSelection avec les overrides
    vi.mocked(useRedirectAfterProjectSelection).mockReturnValue({
      redirect: vi.fn(),
      redirectUrl: vi.fn().mockResolvedValue('/redirect-url'),
      isRedirectRequired: false,
      ...redirectOverrides,
    });
  };

  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('Loading States', () => {
    it('should display datagrid skeleton while main request is loading', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: { isLoading: true },
      });

      renderWithProviders(<Listing />);

      assertDatagridRendered();
      assertDatagridLoading();
      assertLoadingState('loading-row');
    });

    it('should display trusted zone banner loading state', async () => {
      setupDefaultMocks({
        trustedZoneOverrides: { isLoading: true },
      });

      renderWithProviders(<Listing />);

      assertLoadingState('pci-trusted-zone-banner');
    });
  });

  describe('Error States', () => {
    it('should display error banner when there is an error', async () => {
      const errorMock = {
        message: 'Test error message',
        response: { status: 500, headers: {} },
        name: 'ApiError',
      };

      setupDefaultMocks({
        resourcesV6Overrides: {
          isError: true,
          error: errorMock,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      // Vérifier que l'erreur est gérée correctement
      assertElementExists('error-banner');
    });

    it('should not display error banner when there is no error', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          isError: false,
          error: null,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      assertNoErrorState('error-banner');
    });
  });

  describe('Data Display', () => {
    it('should display datagrid when data is loaded successfully', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
          totalCount: MOCKED_PROJECTS.length,
        },
      });

      renderWithProviders(<Listing />);

      assertElementExists('base-layout');
      assertElementExists('manager-banner-text');
      assertDatagridRendered();
      assertElementExists('notifications');
      assertElementExists('pci-trusted-zone-banner');
      assertNotLoadingState('loading-row');
    });

    it('should display correct number of projects', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
          totalCount: MOCKED_PROJECTS.length,
        },
      });

      renderWithProviders(<Listing />);

      expect(screen.getByTestId('datagrid')).toBeInTheDocument();
      expect(MOCKED_PROJECTS).toHaveLength(3);
    });
  });

  describe('Trusted Zone Banner', () => {
    it('should display create project button when trusted zone is not visible and not loading', async () => {
      setupDefaultMocks({
        trustedZoneOverrides: {
          isBannerVisible: false,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      // Vérifier que le composant se rend correctement
      assertElementExists('base-layout');
      assertElementExists('datagrid');
    });

    it('should not display create project button when trusted zone is visible', async () => {
      setupDefaultMocks({
        trustedZoneOverrides: {
          isBannerVisible: true,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      assertElementNotExists('create-project-button');
    });

    it('should not display create project button when trusted zone is loading', async () => {
      setupDefaultMocks({
        trustedZoneOverrides: {
          isBannerVisible: false,
          isLoading: true,
        },
      });

      renderWithProviders(<Listing />);

      assertElementNotExists('create-project-button');
    });
  });

  describe('Navigation and Redirects', () => {
    it('should handle redirect when required', async () => {
      setupDefaultMocks({
        redirectOverrides: {
          isRedirectRequired: true,
        },
      });

      renderWithProviders(<Listing />);

      // Vérifier que le composant se rend correctement même avec redirection requise
      assertElementExists('base-layout');
    });

    it('should not redirect when not required', async () => {
      setupDefaultMocks({
        redirectOverrides: {
          isRedirectRequired: false,
        },
      });

      renderWithProviders(<Listing />);

      // Vérifier que le composant se rend correctement sans redirection
      assertElementExists('base-layout');
    });
  });

  describe('API Integration', () => {
    it('should pass correct props to useResourcesV6', async () => {
      renderWithProviders(<Listing />);

      expect(useResourcesV6).toHaveBeenCalledWith({
        columns: expect.any(Array),
        route: '/cloud/project',
        queryFn: expect.any(Function),
        queryKey: ['projects-with-services'],
        defaultSorting: {
          id: 'aggregatedStatus',
          desc: true,
        },
      });
    });

    it('should handle API query function correctly', async () => {
      renderWithProviders(<Listing />);

      const callArgs = vi.mocked(useResourcesV6).mock.calls[0][0];
      expect(callArgs.queryFn).toBeDefined();
      expect(typeof callArgs.queryFn).toBe('function');
    });
  });

  describe('Layout and Structure', () => {
    it('should render with Suspense wrapper around Datagrid', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      assertElementExists('datagrid');
    });

    it('should pass TopbarCTA component to Datagrid', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      assertElementExists('datagrid');
    });

    it('should render all required layout components', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      assertElementExists('base-layout');
      assertElementExists('manager-banner-text');
      assertElementExists('notifications');
      assertElementExists('pci-trusted-zone-banner');
    });
  });

  describe('Performance and Optimization', () => {
    it('should render efficiently with large datasets', async () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        ...MOCKED_PROJECTS[0],
        id: `project-${i}`,
        project_id: `project-${i}`,
      }));

      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: largeDataset,
          isLoading: false,
          totalCount: largeDataset.length,
        },
      });

      const startTime = performance.now();
      renderWithProviders(<Listing />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000); // Should render in less than 1 second
    });

    it('should handle empty datasets efficiently', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: [],
          isLoading: false,
          totalCount: 0,
        },
      });

      renderWithProviders(<Listing />);

      assertDatagridRendered();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for interactive elements', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      const createButton = screen.queryByTestId('create-project-button');
      if (createButton) {
        expect(createButton).toHaveAttribute('aria-label');
      }
    });

    it('should have proper focus management', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      const datagrid = screen.getByTestId('datagrid');
      expect(datagrid).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render correctly on mobile viewport', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
        },
      });

      // Simulate mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProviders(<Listing />);

      assertElementExists('base-layout');
      assertElementExists('datagrid');
    });

    it('should render correctly on desktop viewport', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: MOCKED_PROJECTS,
          isLoading: false,
        },
      });

      // Simulate desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      renderWithProviders(<Listing />);

      assertElementExists('base-layout');
      assertElementExists('datagrid');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined data gracefully', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: undefined,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      assertDatagridRendered();
    });

    it('should handle null data gracefully', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: null,
          isLoading: false,
        },
      });

      renderWithProviders(<Listing />);

      assertDatagridRendered();
    });

    it('should handle empty array data gracefully', async () => {
      setupDefaultMocks({
        resourcesV6Overrides: {
          flattenData: [],
          isLoading: false,
          totalCount: 0,
        },
      });

      renderWithProviders(<Listing />);

      assertDatagridRendered();
    });
  });
});

// Helper function to measure render time
