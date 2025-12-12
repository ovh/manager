import React from 'react';

import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';
import TenantLayout from '@/pages/tenants/Tenant.layout';
import { Tenant } from '@/types/tenants.type';
import { LABELS } from '@/utils/labels.constants';

// Mock dependencies
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: vi.fn(() => ({ tenantId: 'test-tenant-id' })),
    useMatches: vi.fn(() => []),
    Outlet: () => <div data-testid="outlet">Outlet Content</div>,
  };
});

vi.mock('@/contexts/ObservabilityService.context', () => ({
  useObservabilityServiceContext: vi.fn(),
}));

vi.mock('@/data/hooks/tenants/useTenants.hook', () => ({
  useTenant: vi.fn(),
}));

vi.mock('@/components/metrics/guide-header/MetricsGuideHeader.component', () => ({
  default: () => <div data-testid="metrics-guide-header">MetricsGuideHeader</div>,
}));

// Mock MUK components
vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({
    children,
    header,
    breadcrumb,
    message,
  }: {
    children: React.ReactNode;
    header: { title: string; guideMenu?: React.ReactNode; changelogButton?: React.ReactNode };
    breadcrumb?: React.ReactNode;
    message?: React.ReactNode;
  }) => (
    <div data-testid="base-layout">
      {breadcrumb && <div data-testid="breadcrumb-container">{breadcrumb}</div>}
      <header data-testid="header">
        <h1 data-testid="header-title">{header.title}</h1>
        {header.guideMenu}
        {header.changelogButton}
      </header>
      {message && <div data-testid="message-container">{message}</div>}
      <main>{children}</main>
    </div>
  ),
  Breadcrumb: ({ appName, rootLabel }: { appName: string; rootLabel: string }) => (
    <nav data-testid="breadcrumb" data-app-name={appName} data-root-label={rootLabel}>
      Breadcrumb
    </nav>
  ),
  ChangelogMenu: () => <div data-testid="changelog-menu">ChangelogMenu</div>,
  Notifications: () => <div data-testid="notifications">Notifications</div>,
  Text: ({ children, preset }: { children: React.ReactNode; preset?: string }) => (
    <span data-testid="text" data-preset={preset}>
      {children}
    </span>
  ),
  TEXT_PRESET: {
    paragraph: 'paragraph',
  },
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'tenants:creation.title': 'Create Tenant',
        'tenants:dashboard.title': 'Tenant Dashboard',
        'shared:service': 'Service: {{serviceName}}',
      };
      return translations[key] || key;
    },
  })),
  Trans: ({
    i18nKey,
    values,
  }: {
    i18nKey: string;
    values?: Record<string, string>;
    t?: (key: string) => string;
  }) => (
    <span data-testid="trans" data-i18n-key={i18nKey}>
      Service: {values?.serviceName}
    </span>
  ),
}));

const mockUseObservabilityServiceContext = vi.mocked(useObservabilityServiceContext);
const mockUseTenant = vi.mocked(useTenant);
const mockUseMatches = vi.mocked(
  (await import('react-router-dom')).useMatches,
) as unknown as ReturnType<typeof vi.fn>;

// Helper to create mock tenant query result
const createMockTenantResult = (
  overrides: Partial<UseQueryResult<Tenant, Error>> = {},
): UseQueryResult<Tenant, Error> =>
  ({
    data: undefined,
    isLoading: false,
    isSuccess: false,
    error: null,
    isError: false,
    isPending: false,
    isRefetching: false,
    refetch: vi.fn(),
    status: 'idle',
    fetchStatus: 'idle',
    ...overrides,
  }) as UseQueryResult<Tenant, Error>;

// Test wrapper
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('TenantLayout', () => {
  const mockService = {
    id: 'test-service-id',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: { displayName: 'Test Service' },
  };

  const mockTenant: Tenant = {
    id: 'test-tenant-id',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: {
      title: 'My Custom Tenant',
      description: 'Test tenant description',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockUseObservabilityServiceContext.mockReturnValue({
      selectedService: mockService,
      setSelectedService: vi.fn(),
      services: [],
      isLoading: false,
      isSuccess: true,
      error: null,
    });

    mockUseTenant.mockReturnValue(createMockTenantResult());
    mockUseMatches.mockReturnValue([]);
  });

  describe('Title Resolution', () => {
    it.each([
      {
        name: 'titleKey from route handle',
        matches: [
          {
            id: 'tenant-creation',
            pathname: '/tenants/create',
            handle: { titleKey: 'creation.title' },
          },
        ],
        tenant: undefined,
        expectedTitle: 'Create Tenant',
      },
      {
        name: 'titleKey prioritized over tenant title',
        matches: [
          {
            id: 'tenant-dashboard',
            pathname: '/tenants/123',
            handle: { titleKey: 'dashboard.title' },
          },
        ],
        tenant: mockTenant,
        expectedTitle: 'Tenant Dashboard',
      },
      {
        name: 'titleKey from nested route matches',
        matches: [
          { id: 'root', pathname: '/', handle: undefined },
          { id: 'tenants', pathname: '/tenants', handle: {} },
          {
            id: 'tenant-creation',
            pathname: '/tenants/create',
            handle: { titleKey: 'creation.title' },
          },
        ],
        tenant: undefined,
        expectedTitle: 'Create Tenant',
      },
      {
        name: 'tenant title when no titleKey in route handle',
        matches: [{ id: 'tenant-dashboard', pathname: '/tenants/123', handle: {} }],
        tenant: mockTenant,
        expectedTitle: 'My Custom Tenant',
      },
      {
        name: 'LABELS.TENANT as fallback when no titleKey and no tenant data',
        matches: [],
        tenant: undefined,
        expectedTitle: LABELS.TENANT,
      },
    ])('should use $name', ({ matches, tenant, expectedTitle }) => {
      mockUseMatches.mockReturnValue(matches);

      if (tenant) {
        mockUseTenant.mockReturnValue(
          createMockTenantResult({
            data: tenant,
            isSuccess: true,
          }),
        );
      }

      render(<TenantLayout />, { wrapper: createWrapper() });

      expect(screen.getByTestId('header-title')).toHaveTextContent(expectedTitle);
    });
  });

  describe('Layout Structure', () => {
    it.each([
      { testId: 'base-layout', description: 'BaseLayout' },
      { testId: 'breadcrumb', description: 'Breadcrumb' },
      { testId: 'metrics-guide-header', description: 'MetricsGuideHeader' },
      { testId: 'changelog-menu', description: 'ChangelogMenu' },
      { testId: 'notifications', description: 'Notifications' },
      { testId: 'outlet', description: 'Outlet for child routes' },
    ])('should render $description', ({ testId }) => {
      render(<TenantLayout />, { wrapper: createWrapper() });

      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  describe('Service Display', () => {
    it.each([
      {
        name: 'service displayName when available',
        service: mockService,
        expectedText: 'Service: Test Service',
      },
      {
        name: 'service id when displayName is not available',
        service: { ...mockService, currentState: { displayName: null } },
        expectedText: 'Service: test-service-id',
      },
    ])('should display $name', ({ service, expectedText }) => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: service,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: true,
        error: null,
      });

      render(<TenantLayout />, { wrapper: createWrapper() });

      expect(screen.getByTestId('trans')).toHaveTextContent(expectedText);
    });
  });

  describe('Data Fetching', () => {
    it.each([
      {
        name: 'correct parameters when service is selected',
        service: mockService,
        expectedServiceId: 'test-service-id',
        expectedTenantId: 'test-tenant-id',
      },
      {
        name: 'empty service id when no service is selected',
        service: undefined,
        expectedServiceId: '',
        expectedTenantId: 'test-tenant-id',
      },
    ])('should call useTenant with $name', ({ service, expectedServiceId, expectedTenantId }) => {
      mockUseObservabilityServiceContext.mockReturnValue({
        selectedService: service,
        setSelectedService: vi.fn(),
        services: [],
        isLoading: false,
        isSuccess: service !== undefined,
        error: null,
      });

      render(<TenantLayout />, { wrapper: createWrapper() });

      expect(mockUseTenant).toHaveBeenCalledWith(expectedServiceId, expectedTenantId);
    });
  });
});
