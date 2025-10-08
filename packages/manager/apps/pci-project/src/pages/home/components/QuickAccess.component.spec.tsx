import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { createWrapper } from '@/wrapperRenders';
import QuickAccess from './QuickAccess.component';
import { DASHBOARD_QUICK_ACCESS_ITEMS_BASE, DashboardItem } from '@/constants';

// Mock the external hook
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

// Mock the translation hook
vi.mock('@/hooks/usePermissiveTranslation.hook', () => ({
  default: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the dashboard links hook
vi.mock('@/hooks/home/useDashboardLinks', () => ({
  useDashboardLinks: (items: DashboardItem[]) => items,
}));

// Mock the tracking hook
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({
    trackClick: vi.fn(),
  }),
  ShellContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

const mockUseFeatureAvailability = vi.mocked(useFeatureAvailability);

describe('QuickAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all quick access items when all features are available', async () => {
    mockUseFeatureAvailability.mockReturnValue({
      data: {
        instance: true,
        kubernetes: true,
        'object-storage': true,
        'block-storage': true,
        'private-network': true,
        databases: true,
      },
    } as unknown as ReturnType<typeof useFeatureAvailability>);

    render(<QuickAccess />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_quick_access')).toBeInTheDocument();
    });

    // Check that all expected items are rendered
    expect(screen.getByText('pci_projects_home_instances')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_kubernetes')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_object_storage')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_block_storage')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_network')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_database')).toBeInTheDocument();
  });

  it('should filter out items when features are not available', async () => {
    mockUseFeatureAvailability.mockReturnValue({
      data: {
        instance: true,
        kubernetes: false, // Disabled
        'object-storage': true,
        'block-storage': false, // Disabled
        'private-network': true,
        databases: false, // Disabled
      },
    } as unknown as ReturnType<typeof useFeatureAvailability>);

    render(<QuickAccess />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_quick_access')).toBeInTheDocument();
    });

    // Check that available items are rendered
    expect(screen.getByText('pci_projects_home_instances')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_object_storage')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_network')).toBeInTheDocument();

    // Check that disabled items are not rendered
    expect(screen.queryByText('pci_projects_home_kubernetes')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_block_storage')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_database')).not.toBeInTheDocument();
  });

  it('should render no items when no features are available', async () => {
    mockUseFeatureAvailability.mockReturnValue({
      data: {
        instance: false,
        kubernetes: false,
        'object-storage': false,
        'block-storage': false,
        'private-network': false,
        databases: false,
      },
    } as unknown as ReturnType<typeof useFeatureAvailability>);

    render(<QuickAccess />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_quick_access')).toBeInTheDocument();
    });

    // Check that no items are rendered
    expect(screen.queryByText('pci_projects_home_instances')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_kubernetes')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_object_storage')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_block_storage')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_network')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_database')).not.toBeInTheDocument();
  });

  it('should handle undefined feature availability data', async () => {
    mockUseFeatureAvailability.mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useFeatureAvailability>);

    render(<QuickAccess />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_quick_access')).toBeInTheDocument();
    });

    // When data is undefined, no items should be rendered (all features considered unavailable)
    expect(screen.queryByText('pci_projects_home_instances')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_kubernetes')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_object_storage')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_block_storage')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_network')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_database')).not.toBeInTheDocument();
  });

  it('should call useFeatureAvailability with correct feature flags', () => {
    mockUseFeatureAvailability.mockReturnValue({
      data: {},
    } as unknown as ReturnType<typeof useFeatureAvailability>);

    render(<QuickAccess />, { wrapper: createWrapper() });

    expect(mockUseFeatureAvailability).toHaveBeenCalledWith(
      [
        'instance',
        'kubernetes',
        'object-storage',
        'block-storage',
        'private-network',
        'databases',
      ],
      { enabled: true },
    );
  });

  it('should render items with correct icons when features are available', async () => {
    mockUseFeatureAvailability.mockReturnValue({
      data: {
        instance: true,
        kubernetes: true,
        'object-storage': false,
        'block-storage': false,
        'private-network': false,
        databases: false,
      },
    } as unknown as ReturnType<typeof useFeatureAvailability>);

    render(<QuickAccess />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_quick_access')).toBeInTheDocument();
    });

    // Check that only available items are rendered
    expect(screen.getByText('pci_projects_home_instances')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_kubernetes')).toBeInTheDocument();

    // Check that disabled items are not rendered
    expect(screen.queryByText('pci_projects_home_object_storage')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_block_storage')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_network')).not.toBeInTheDocument();
    expect(screen.queryByText('pci_projects_home_database')).not.toBeInTheDocument();
  });
});
