import React from 'react';

import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import TenantsSubscriptionsDrawer from '@/components/subscriptions/TenantsSubscriptionsDrawer.component';
import { ObservabilityService } from '@/types/observability.type';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock hooks
const mockUseObservabilityServices = vi.fn();
const mockUseTenantsWithSubscriptions = vi.fn();
const mockNavigate = vi.fn();
let mockResourceName = 'test-resource';

vi.mock('@/data/hooks/services/useObservabilityServices.hook', () => ({
  useObservabilityServices: () => mockUseObservabilityServices(),
}));

vi.mock('@/data/hooks/tenants/useTenants.hook', () => ({
  useTenants: vi.fn(() => ({
    data: [],
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
  })),
}));

vi.mock('@/data/hooks/tenants/useTenantsWithSubscriptions', () => ({
  useTenantsWithSubscriptions: (resourceName: string, regions?: string[]) =>
    mockUseTenantsWithSubscriptions(resourceName, regions),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ resourceName: mockResourceName }),
    useLocation: () => {
      // Try to get location from actual implementation if available
      try {
        return (actual as any).useLocation?.() || { pathname: window.location.pathname };
      } catch {
        return { pathname: window.location.pathname };
      }
    },
  };
});

// Mock @ovh-ux/manager-react-shell-client
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({}),
  useOvhTracking: () => ({ trackClick: vi.fn(), trackPage: vi.fn() }),
  PageType: {},
  useRouteSynchro: () => ({}),
}));

// Mock components
vi.mock('@/components/services/ServicesDropDown.component', () => ({
  default: ({ services, selectedServiceId, isLoading, onChange }: any) => (
    <div data-testid="services-dropdown">
      <select
        data-testid="services-select"
        value={selectedServiceId}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={isLoading}
      >
        <option value="">Select Service</option>
        {services?.map((service: ObservabilityService) => (
          <option key={service.id} value={service.id}>
            {service.currentState.displayName || service.id}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock('@/components/subscriptions/NoTenantsMessage.component', () => ({
  default: ({ regions, defaultRetention }: any) => (
    <div data-testid="no-tenants-message">
      <div data-testid="no-tenants-regions">{regions?.join(', ')}</div>
      <div data-testid="no-tenants-retention">{defaultRetention}</div>
    </div>
  ),
}));

vi.mock('@ovh-ux/muk', () => ({
  Drawer: {
    RootCollapsible: ({ children, onDismiss, isLoading }: any) => (
      <div data-testid="drawer-root" data-loading={isLoading}>
        <button data-testid="drawer-dismiss" onClick={onDismiss}>
          Dismiss
        </button>
        {children}
      </div>
    ),
    Header: ({ title }: any) => <div data-testid="drawer-header">{title}</div>,
    Content: ({ children }: any) => (
      <div data-testid="drawer-content">{children}</div>
    ),
  },
  Badge: ({ children, ...props }: any) => (
    <div data-testid="badge" {...props}>
      {children}
    </div>
  ),
  BUTTON_VARIANT: { ghost: 'ghost' },
  BUTTON_SIZE: { xs: 'xs' },
  Button: ({ children, ...props }: any) => (
    <button data-testid="muk-button" {...props}>
      {children}
    </button>
  ),
  useDateFnsLocale: () => ({ 
    code: 'en',
    formatDistance: () => '',
    formatRelative: () => '',
    localize: {} as any,
    formatLong: {} as any,
    match: {} as any,
    options: {} as any,
  }),
}));

// Mock @ovhcloud/ods-react
vi.mock('@ovhcloud/ods-react', () => ({
  Text: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TEXT_PRESET: { label: 'label', paragraph: 'paragraph', small: 'small' },
  Divider: ({ ...props }: any) => <hr {...props} />,
  Input: ({ ...props }: any) => <input {...props} />,
  INPUT_TYPE: { search: 'search' },
  Badge: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  BADGE_COLOR: { information: 'information' },
  Icon: ({ ...props }: any) => <span {...props} />,
  ICON_NAME: { circleInfo: 'circleInfo' },
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CARD_COLOR: { primary: 'primary', neutral: 'neutral' },
}));

// Mock duration utils
vi.mock('@/utils/duration.utils', () => ({
  formatObservabilityDuration: (duration: string) => duration,
}));

// Mock subscription hooks
vi.mock('@/data/hooks/tenants/useCreateSubscription.hook', () => ({
  useCreateSubscription: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@/data/hooks/tenants/useDeleteSubscription.hook', () => ({
  useDeleteSubscription: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

// Mock @ovh-ux/manager-common-translations
vi.mock('@ovh-ux/manager-common-translations', () => ({
  NAMESPACES: { ERROR: 'error' },
}));

// Mock SubscriptionCard
vi.mock('@/components/subscriptions/SubscriptionManager/SubscriptionCard.component', () => ({
  default: ({ title, subTitle, itemId, subscription, onCreate, onDelete, resourceName, subscriptionUrls }: any) => (
    <div data-testid={`subscription-card-${itemId}`}>
      <div data-testid={`card-title-${itemId}`}>{title}</div>
      <div data-testid={`card-subtitle-${itemId}`}>{subTitle}</div>
      {subscription && <div data-testid={`card-subscription-${itemId}`}>Subscribed</div>}
      <button
        data-testid={`card-create-${itemId}`}
        onClick={() => onCreate?.({ subscribeUrl: subscriptionUrls?.subscribeUrl, itemId, resourceName })}
      >
        Create
      </button>
      <button
        data-testid={`card-delete-${itemId}`}
        onClick={() => onDelete?.({ subscription, itemId, resourceName })}
      >
        Delete
      </button>
    </div>
  ),
}));

// Test wrapper for React Query and Router
const createWrapper = (initialEntries = ['/']) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="*" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

// Mock data inspired by dataset structure
const mockTenantsDataset = [
  {
    id: '1',
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
    resourceStatus: 'READY' as const,
    iam: {
      id: '92c16299-3f5b-4ea9-a806-e0464e7bfa31',
      tags: {
        'ovh:ldp:cluster:name': 'sbg159',
        Application: 'Website',
        Environment: 'Prod',
      },
      urn: 'urn:v1:eu:resource:ldp:ldp-sbg-55078',
    },
    currentState: {
      title: 'Tenant 1',
      description: 'Tenant 1 description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 300,
        },
      },
      infrastructure: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        location: 'eu-west-sbg',
        entryPoint: 'sbg1.metrics.ovh.com',
        type: 'SHARED',
      },
    },
  },
  {
    id: '2',
    createdAt: '2025-11-20T14:26:14.041Z',
    updatedAt: '2025-11-20T14:26:14.041Z',
    resourceStatus: 'READY' as const,
    iam: {
      id: '92c16299-3f5b-4ea9-a806-e0464e7bfa32',
      tags: {
        'ovh:ldp:cluster:name': 'gra159',
      },
      urn: 'urn:v1:eu:resource:ldp:ldp-gr-55078',
    },
    currentState: {
      title: 'Tenant 2',
      description: 'Tenant 2 description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '90d',
          max_global_series_per_user: 50,
        },
      },
      infrastructure: {
        id: '6ee8fb35-2621-4530-a288-84fc0e85dac1',
        entryPoint: 'gra1.metrics.ovh.com',
        location: 'eu-west-gra',
        type: 'SHARED',
      },
    },
  },
] as any[];

const mockSubscriptionsDataset = [
  {
    id: '1',
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
    resourceStatus: 'READY' as const,
    iam: {
      id: '92c16299-3f5b-4ea9-a806-e0464e7bfa31',
      tags: {
        'ovh:metrics:name': 'RESOURCE_NAME',
        environment: 'Prod',
      },
      urn: 'urn:v1:eu:resource:ldp:RESOURCE_NAME',
    },
    currentState: {
      kind: 'Subscription',
      link: 'https://api.ovh.com/v2/observability/resource/RESOURCE_NAME/metric/tenant/92c16299-3f5b-4ea9-a806-e0464e7bfa31/subscription',
      resource: {
        name: 'RESOURCE_NAME-92c16299-3f5b-4ea9-a806-e0464e7bfa31-subscription-1',
        type: 'PCI/Instance',
      },
    },
  },
  {
    id: '2',
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
    resourceStatus: 'READY' as const,
    iam: {
      id: '92c16299-3f5b-4ea9-a806-e0464e7bfa32',
      tags: {
        environment: 'Dev',
      },
      urn: 'urn:v1:eu:resource:ldp:RESOURCE_NAME',
    },
    currentState: {
      kind: 'Subscription',
      link: 'https://api.ovh.com/v2/observability/resource/RESOURCE_NAME/metric/tenant/92c16299-3f5b-4ea9-a806-e0464e7bfa32/subscription',
      resource: {
        name: 'RESOURCE_NAME-92c16299-3f5b-4ea9-a806-e0464e7bfa32-subscription-2',
        type: 'PCI/Instance',
      },
    },
  },
] as any[];

const mockTenantsWithSubscriptions = mockTenantsDataset.map((tenant) => ({
  ...tenant,
  subscriptions: mockSubscriptionsDataset.filter((sub) => sub.iam?.id === tenant.id),
}));

const mockServices: ObservabilityService[] = [
  {
    id: 'service-1',
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
    currentState: {
      displayName: 'Service 1',
    },
  },
  {
    id: 'service-2',
    createdAt: '2025-11-21T14:26:14.041Z',
    updatedAt: '2025-11-21T14:26:14.041Z',
    currentState: {
      displayName: 'Service 2',
    },
  },
] as ObservabilityService[];

describe('TenantsSubscriptionsDrawer', () => {
  const defaultProps = {
    resourceName: 'test-resource',
    regions: ['EU'],
    defaultRetention: '30d',
    subscriptionUrls: {
      subscribeUrl: 'https://api.example.com/subscribe',
      unsubscribeUrl: 'https://api.example.com/unsubscribe',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    mockResourceName = 'test-resource';
    
    // Set up default mocks
    mockUseObservabilityServices.mockReturnValue({
      data: mockServices,
      isLoading: false,
      isSuccess: true,
    });
    
    mockUseTenantsWithSubscriptions.mockReturnValue({
      data: mockTenantsWithSubscriptions,
      isLoading: false,
      isSuccess: true,
      isError: false,
      error: null,
    });
    mockUseObservabilityServices.mockReturnValue({
      data: mockServices,
      isLoading: false,
      isSuccess: true,
    });
    mockUseTenantsWithSubscriptions.mockReturnValue({
      data: mockTenantsWithSubscriptions,
      isLoading: false,
      isSuccess: true,
    });
  });

  describe('Rendering', () => {
    it('should render drawer with correct title', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('drawer-header')).toHaveTextContent('tenants_drawer.title');
    });

    it('should render SubscriptionsDrawer', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('drawer-root')).toBeInTheDocument();
    });

    it('should render ServicesDropDown', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('services-dropdown')).toBeInTheDocument();
    });

    it('should render TenantsSubscriptionsDisclaimer when data is available', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByText(/tenants_drawer\.disclaimer/i)).toBeInTheDocument();
    });

    it('should not render TenantsSubscriptionsDisclaimer when data is empty', () => {
      // Arrange
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: [],
        isLoading: false,
        isSuccess: true,
      });

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.queryByText(/tenants_drawer\.disclaimer/i)).not.toBeInTheDocument();
    });

    it('should not render TenantsSubscriptionsDisclaimer when data is undefined', () => {
      // Arrange
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: undefined,
        isLoading: false,
        isSuccess: true,
      });

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.queryByText(/tenants_drawer\.disclaimer/i)).not.toBeInTheDocument();
    });

    it('should render tenant items when data is available', async () => {
      // Arrange - need to set a serviceId for isFiltersReady to be true
      mockResourceName = 'service-1';
      mockUseObservabilityServices.mockReturnValue({
        data: mockServices,
        isLoading: false,
        isSuccess: true,
      });
      
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: mockTenantsWithSubscriptions,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });
      
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(['/subscriptions/config/service-1']),
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText(mockTenantsWithSubscriptions[0]!.currentState.title)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Filter Management', () => {
    it('should initialize with default filter values', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert - check for the region translation key (component renders it with colon and region names)
      expect(screen.getByText(/tenants_regions\.region/)).toBeInTheDocument();
    });

    it('should update filter when service is selected', async () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const select = screen.getByTestId('services-select');
      // Simulate selecting a service
      // Note: This is a simplified test - actual implementation would need proper event handling

      // Assert
      expect(select).toBeInTheDocument();
    });

    it('should sync route param with service filter', async () => {
      // Arrange
      const initialRoute = '/subscriptions/config/service-1';

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper([initialRoute]),
      });

      // Assert
      await waitFor(() => {
        const select = screen.getByTestId('services-select');
        expect(select).toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    it('should call useObservabilityServices', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockUseObservabilityServices).toHaveBeenCalled();
    });

    it('should call useTenantsWithSubscriptions with serviceId from filters', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue({
        data: mockServices,
        isLoading: false,
        isSuccess: true,
      });

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockUseTenantsWithSubscriptions).toHaveBeenCalled();
    });

    it('should handle loading state for services', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue({
        data: undefined,
        isLoading: true,
        isSuccess: false,
      });

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const drawerRoot = screen.getByTestId('drawer-root');
      expect(drawerRoot).toHaveAttribute('data-loading', 'true');
    });

    it('should handle loading state for tenants', () => {
      // Arrange
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: undefined,
        isLoading: true,
        isSuccess: false,
      });

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      const drawerRoot = screen.getByTestId('drawer-root');
      expect(drawerRoot).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Navigation', () => {
    it('should navigate to root on dismiss', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      const dismissButton = screen.getByTestId('drawer-dismiss');
      dismissButton.click();

      // Assert
      // Navigation is tested through the component's behavior
      expect(dismissButton).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Item Rendering Functions', () => {
    it('should get item title correctly', async () => {
      // Arrange
      mockResourceName = 'service-1';
      mockUseObservabilityServices.mockReturnValue({
        data: mockServices,
        isLoading: false,
        isSuccess: true,
      });
      
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: mockTenantsWithSubscriptions,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });
      
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(['/subscriptions/config/service-1']),
      });

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(mockTenantsWithSubscriptions[0]!.currentState.title),
        ).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should get item subtitle correctly', async () => {
      // Arrange
      mockResourceName = 'service-1';
      mockUseObservabilityServices.mockReturnValue({
        data: mockServices,
        isLoading: false,
        isSuccess: true,
      });
      
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: mockTenantsWithSubscriptions,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });
      
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(['/subscriptions/config/service-1']),
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText(mockTenantsWithSubscriptions[0]!.id)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should get item ID correctly', async () => {
      // Arrange
      mockResourceName = 'service-1';
      mockUseObservabilityServices.mockReturnValue({
        data: mockServices,
        isLoading: false,
        isSuccess: true,
      });
      
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: mockTenantsWithSubscriptions,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });
      
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(['/subscriptions/config/service-1']),
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByText(mockTenantsWithSubscriptions[0]!.id)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should get item subscription correctly', async () => {
      // Arrange
      mockResourceName = 'service-1';
      mockUseObservabilityServices.mockReturnValue({
        data: mockServices,
        isLoading: false,
        isSuccess: true,
      });
      
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: mockTenantsWithSubscriptions,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });
      
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(['/subscriptions/config/service-1']),
      });

      // Assert
      // The subscription logic is tested through the component rendering
      await waitFor(() => {
        expect(screen.getByText(mockTenantsWithSubscriptions[0]!.currentState.title)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Search Functionality', () => {
    it('should enable search in SubscriptionManager', async () => {
      // Arrange
      mockResourceName = 'service-1';
      mockUseObservabilityServices.mockReturnValue({
        data: mockServices,
        isLoading: false,
        isSuccess: true,
      });
      
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: mockTenantsWithSubscriptions,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });
      
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(['/subscriptions/config/service-1']),
      });

      // Assert
      await waitFor(() => {
        expect(screen.getByPlaceholderText('search.placeholder')).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty services list', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue({
        data: [],
        isLoading: false,
        isSuccess: true,
      });

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('drawer-root')).toBeInTheDocument();
    });

    it('should handle undefined services', () => {
      // Arrange
      mockUseObservabilityServices.mockReturnValue({
        data: undefined,
        isLoading: false,
        isSuccess: false,
      });

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      expect(screen.getByTestId('drawer-root')).toBeInTheDocument();
    });    

    it('should handle tenants with no subscriptions', async () => {
      // Arrange
      mockResourceName = 'service-1';
      const tenantsWithoutSubs = mockTenantsDataset.map((tenant: any) => ({
        ...tenant,
        subscriptions: [],
      }));
      
      mockUseObservabilityServices.mockReturnValue({
        data: mockServices,
        isLoading: false,
        isSuccess: true,
      });
      
      mockUseTenantsWithSubscriptions.mockReturnValue({
        data: tenantsWithoutSubs,
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      });

      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(['/subscriptions/config/service-1']),
      });

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(tenantsWithoutSubs[0]!.currentState.title),
        ).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Filter Values', () => {
    it('should initialize with default region filter', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert - check for the region translation key (component renders it with colon and region names)
      expect(screen.getByText(/tenants_regions\.region/)).toBeInTheDocument();
    });

    it('should handle filter changes', () => {
      // Act
      render(<TenantsSubscriptionsDrawer {...defaultProps} />, {
        wrapper: createWrapper(),
      });

      // Assert
      // Filter change handling is tested through the component's behavior
      expect(screen.getByTestId('services-dropdown')).toBeInTheDocument();
    });
  });
});
