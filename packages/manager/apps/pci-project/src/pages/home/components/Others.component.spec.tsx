import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { createWrapper } from '@/wrapperRenders';
import Others from './Others.component';
import { DASHBOARD_OTHER_ACTIONS_ITEMS } from '@/constants';

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
  useDashboardLinks: (items: any[]) => items,
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

describe('Others', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all other actions when all features are available', async () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        'pci-ai-notebooks': true,
        'load-balancer': true,
        'public-cloud:billing': true,
        'public-cloud:quota': true,
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    render(<Others />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_others')).toBeInTheDocument();
    });

    // Check that all expected items are rendered
    expect(
      screen.getByText('pci_projects_home_create_ai_notebook'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('pci_projects_home_create_load_balancer'),
    ).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_billing')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_quotas')).toBeInTheDocument();
  });

  it('should filter out items when features are not available', async () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        'pci-ai-notebooks': true,
        'load-balancer': false, // Disabled
        'public-cloud:billing': true,
        'public-cloud:quota': false, // Disabled
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    render(<Others />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_others')).toBeInTheDocument();
    });

    // Check that available items are rendered
    expect(
      screen.getByText('pci_projects_home_create_ai_notebook'),
    ).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_billing')).toBeInTheDocument();

    // Check that disabled items are not rendered
    expect(
      screen.queryByText('pci_projects_home_create_load_balancer'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_quotas'),
    ).not.toBeInTheDocument();
  });

  it('should render no items when no features are available', async () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        'pci-ai-notebooks': false,
        'load-balancer': false,
        'public-cloud:billing': false,
        'public-cloud:quota': false,
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    render(<Others />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_others')).toBeInTheDocument();
    });

    // Check that no items are rendered
    expect(
      screen.queryByText('pci_projects_home_create_ai_notebook'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_create_load_balancer'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_billing'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_quotas'),
    ).not.toBeInTheDocument();
  });

  it('should handle undefined feature availability data', async () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: undefined,
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    render(<Others />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_others')).toBeInTheDocument();
    });

    // When data is undefined, no items should be rendered (all features considered unavailable)
    expect(
      screen.queryByText('pci_projects_home_create_ai_notebook'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_create_load_balancer'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_billing'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_quotas'),
    ).not.toBeInTheDocument();
  });

  it('should call useFeatureAvailability with correct feature flags', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {},
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    render(<Others />, { wrapper: createWrapper() });

    expect(mockUseFeatureAvailability).toHaveBeenCalledWith(
      [
        'pci-ai-notebooks',
        'load-balancer',
        'public-cloud:billing',
        'public-cloud:quota',
      ],
      { enabled: true },
    );
  });

  it('should render only notebooks when only notebooks feature is available', async () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        'pci-ai-notebooks': true,
        'load-balancer': false,
        'public-cloud:billing': false,
        'public-cloud:quota': false,
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    render(<Others />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_others')).toBeInTheDocument();
    });

    // Check that only notebooks is rendered
    expect(
      screen.getByText('pci_projects_home_create_ai_notebook'),
    ).toBeInTheDocument();

    // Check that other items are not rendered
    expect(
      screen.queryByText('pci_projects_home_create_load_balancer'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_billing'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_quotas'),
    ).not.toBeInTheDocument();
  });

  it('should render only billing and quota when only those features are available', async () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {
        'pci-ai-notebooks': false,
        'load-balancer': false,
        'public-cloud:billing': true,
        'public-cloud:quota': true,
      },
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    render(<Others />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('pci_projects_home_others')).toBeInTheDocument();
    });

    // Check that billing and quota are rendered
    expect(screen.getByText('pci_projects_home_billing')).toBeInTheDocument();
    expect(screen.getByText('pci_projects_home_quotas')).toBeInTheDocument();

    // Check that other items are not rendered
    expect(
      screen.queryByText('pci_projects_home_create_ai_notebook'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('pci_projects_home_create_load_balancer'),
    ).not.toBeInTheDocument();
  });
});
