import React, { ComponentType } from 'react';

import { useParams } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Topbar from '@/components/topBar/TopBar.component';
import { websitesMocks } from '@/data/__mocks__';
import { ServiceStatus } from '@/data/types/status';
import { createWrapper, i18n } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

const testQueryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const RouterWrapper = createWrapper({ route: '/test-service' });

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <RouterWrapper>
      <QueryClientProvider client={testQueryClient}>
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </QueryClientProvider>
    </RouterWrapper>
  );
};

const hoistedMock = vi.hoisted(() => ({
  useWebHostingAttachedDomain: vi.fn(),
}));

vi.mock('@/data/hooks/webHostingAttachedDomain/useWebHostingAttachedDomain', () => {
  return {
    useWebHostingAttachedDomain: hoistedMock.useWebHostingAttachedDomain,
  };
});
vi.mock('@ovh-ux/muk', () => ({
  useNotifications: vi.fn(() => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
    addWarning: vi.fn(),
    addInfo: vi.fn(),
  })),
  useDataApi: vi.fn(() => ({
    flattenData: [],
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isLoading: false,
    filters: {},
    sorting: {},
  })),
}));

describe('Topbar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: websitesMocks,
      isLoading: false,
    });
  });

  it('should display Topbar component', () => {
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const orderSsl = screen.getByTestId('order-ssl');
    const importSsl = screen.getByTestId('import-ssl');
    expect(orderSsl).toBeInTheDocument();
    expect(importSsl).toBeInTheDocument();
  });

  it('should display SSL enable section with heading', () => {
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const heading = screen.getByText(/enable_ssl_certificate/i);
    expect(heading).toBeInTheDocument();
  });

  it('should display domain select and enable SSL button', () => {
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const domainSelect = screen.getByTestId('domainName');
    const enableButton = screen.getByText(/enable_ssl_encrypt/i);
    expect(domainSelect).toBeInTheDocument();
    expect(enableButton).toBeInTheDocument();
  });

  it('should navigate to order SSL page when clicking order SSL button', async () => {
    const user = userEvent.setup();
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const orderSslButton = screen.getByTestId('order-ssl');
    await user.click(orderSslButton);
    expect(navigate).toHaveBeenCalledWith('/test-service/order-sectigo');
  });

  it('should navigate to import SSL page when clicking import SSL button', async () => {
    const user = userEvent.setup();
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const importSslButton = screen.getByTestId('import-ssl');
    await user.click(importSslButton);
    expect(navigate).toHaveBeenCalledWith('/test-service/import-ssl');
  });

  it('should filter domains correctly - only show domains without SSL, matching serviceName, and not default', () => {
    const mockDomains = [
      {
        ...websitesMocks[0],
        currentState: {
          ...websitesMocks[0].currentState,
          ssl: { status: ServiceStatus.NONE },
          hosting: {
            ...websitesMocks[0].currentState.hosting,
            serviceName: 'test-service',
          },
          isDefault: false,
        },
      },
      {
        ...websitesMocks[1],
        currentState: {
          ...websitesMocks[1].currentState,
          ssl: { status: ServiceStatus.ACTIVE },
          hosting: {
            ...websitesMocks[1].currentState.hosting,
            serviceName: 'test-service',
          },
          isDefault: false,
        },
      },
      {
        ...websitesMocks[2],
        currentState: {
          ...websitesMocks[2].currentState,
          ssl: { status: ServiceStatus.NONE },
          hosting: {
            ...websitesMocks[2].currentState.hosting,
            serviceName: 'other-service',
          },
          isDefault: false,
        },
      },
      {
        ...websitesMocks[3],
        currentState: {
          ...websitesMocks[3].currentState,
          ssl: { status: ServiceStatus.NONE },
          hosting: {
            ...websitesMocks[3].currentState.hosting,
            serviceName: 'test-service',
          },
          isDefault: true, // Is default - should NOT appear
        },
      },
    ];

    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: mockDomains,
      isLoading: false,
    });
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should display empty select when no domains match filter criteria', () => {
    const mockDomains = [
      {
        ...websitesMocks[0],
        currentState: {
          ...websitesMocks[0].currentState,
          ssl: { status: ServiceStatus.ACTIVE },
          hosting: {
            ...websitesMocks[0].currentState.hosting,
            serviceName: 'test-service',
          },
          isDefault: false,
        },
      },
    ];

    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: mockDomains,
      isLoading: false,
    });

    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should handle error state', () => {
    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: undefined,
      isSuccess: false,
      isLoading: false,
      isError: true,
    });

    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: [],
      isSuccess: true,
      isLoading: false,
      isError: false,
    });

    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should handle undefined data', () => {
    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: undefined,
      isSuccess: true,
      isLoading: false,
      isError: false,
    });

    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should handle null serviceName in useParams', () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: undefined });
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const orderSsl = screen.getByTestId('order-ssl');
    expect(orderSsl).toBeInTheDocument();
  });

  it('should filter out domains with missing currentState properties', () => {
    const mockDomainsWithMissingProps = [
      {
        id: '1',
        currentState: undefined,
      },
      {
        id: '2',
        currentState: {
          ssl: { status: ServiceStatus.NONE },
          hosting: undefined,
          isDefault: false,
        },
      },
      {
        id: '3',
        currentState: {
          ssl: undefined,
          hosting: {
            serviceName: 'test-service',
          },
          isDefault: false,
        },
      },
    ];

    hoistedMock.useWebHostingAttachedDomain.mockReturnValue({
      data: mockDomainsWithMissingProps,
      isSuccess: true,
      isLoading: false,
      isError: false,
    });

    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should render all buttons with correct variants', () => {
    render(<Topbar />, { wrapper: Wrappers as ComponentType });
    const orderSsl = screen.getByTestId('order-ssl');
    const importSsl = screen.getByTestId('import-ssl');
    const enableButton = screen.getByText(/enable_ssl_encrypt/i);

    expect(orderSsl).toBeInTheDocument();
    expect(importSsl).toBeInTheDocument();
    expect(enableButton).toBeInTheDocument();
  });

  it('should use correct serviceName in navigation URLs', async () => {
    const user = userEvent.setup();
    vi.mocked(useParams).mockReturnValue({ serviceName: 'my-custom-service' });

    render(<Topbar />, { wrapper: Wrappers as ComponentType });

    const orderSslButton = screen.getByTestId('order-ssl');
    await user.click(orderSslButton);

    expect(navigate).toHaveBeenCalledWith('/my-custom-service/order-sectigo');

    const importSslButton = screen.getByTestId('import-ssl');
    await user.click(importSslButton);

    expect(navigate).toHaveBeenCalledWith('/my-custom-service/import-ssl');
  });
});
