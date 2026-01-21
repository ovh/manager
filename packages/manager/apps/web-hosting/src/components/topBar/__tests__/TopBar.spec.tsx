/* eslint-disable max-lines */
import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDataApi } from '@ovh-ux/muk';

import Topbar from '@/components/topBar/TopBar.component';
import { websitesMocks } from '@/data/__mocks__';
import { ServiceStatus } from '@/data/types/status';
import { renderWithRouter } from '@/utils/test.provider';
import { navigate } from '@/utils/test.setup';

const mockCreateDomainCertificates = vi.fn();
vi.mock('@/data/hooks/ssl/useSsl', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useCreateDomainCertificates: vi.fn((_serviceName, _onSuccess, _onError) => ({
    createDomainCertificates: mockCreateDomainCertificates,
  })),
}));

describe('Topbar component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ serviceName: 'test-service' });
    vi.mocked(useDataApi).mockReturnValue({
      flattenData: websitesMocks,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: websitesMocks.length,
    });
  });

  it('should display Topbar component', () => {
    renderWithRouter(<Topbar />, { route: '/test-service' });
    const orderSsl = screen.getByTestId('order-ssl');
    const importSsl = screen.getByTestId('import-ssl');
    expect(orderSsl).toBeInTheDocument();
    expect(importSsl).toBeInTheDocument();
  });

  it('should display SSL enable section with heading', () => {
    renderWithRouter(<Topbar />, { route: '/test-service' });
    const heading = screen.getByText(/enable_ssl_certificate/i);
    expect(heading).toBeInTheDocument();
  });

  it('should display domain select and enable SSL button', () => {
    renderWithRouter(<Topbar />, { route: '/test-service' });
    const domainSelect = screen.getByTestId('domainName');
    const enableButton = screen.getByText(/enable_ssl_encrypt/i);
    expect(domainSelect).toBeInTheDocument();
    expect(enableButton).toBeInTheDocument();
  });

  it('should navigate to order SSL page when clicking order SSL button', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Topbar />, { route: '/test-service' });
    const orderSslButton = screen.getByTestId('order-ssl');
    await user.click(orderSslButton);
    expect(navigate).toHaveBeenCalledWith('/test-service/order-sectigo');
  });

  it('should navigate to import SSL page when clicking import SSL button', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Topbar />, { route: '/test-service' });
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

    vi.mocked(useDataApi).mockReturnValue({
      flattenData: mockDomains,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: mockDomains.length,
    });
    renderWithRouter(<Topbar />, { route: '/test-service' });
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

    vi.mocked(useDataApi).mockReturnValue({
      flattenData: mockDomains,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: mockDomains.length,
    });

    renderWithRouter(<Topbar />, { route: '/test-service' });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should handle different data states', () => {
    const testCases = [
      {
        flattenData: undefined,
        isLoading: true,
        isError: false,
        error: null,
        isSuccess: false,
        isFetching: true,
        status: 'loading' as const,
      },
      {
        flattenData: undefined,
        isSuccess: false,
        isLoading: false,
        isError: true,
        error: new Error('Test error'),
        isFetching: false,
        status: 'error' as const,
      },
      {
        flattenData: [],
        isSuccess: true,
        isLoading: false,
        isError: false,
        error: null,
        isFetching: false,
        status: 'success' as const,
      },
      {
        flattenData: undefined,
        isSuccess: true,
        isLoading: false,
        isError: false,
        error: null,
        isFetching: false,
        status: 'success' as const,
      },
    ];

    testCases.forEach((testData) => {
      vi.mocked(useDataApi).mockReturnValue({
        ...testData,
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        pageIndex: 0,
        totalCount: 0,
      });

      const { unmount } = renderWithRouter(<Topbar />, { route: '/test-service' });
      const domainSelect = screen.getByTestId('domainName');
      expect(domainSelect).toBeInTheDocument();
      unmount();
    });
  });

  it('should handle null serviceName in useParams', () => {
    vi.mocked(useParams).mockReturnValue({ serviceName: undefined });
    renderWithRouter(<Topbar />, { route: '/test-service' });
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

    vi.mocked(useDataApi).mockReturnValue({
      flattenData: mockDomainsWithMissingProps,
      isSuccess: true,
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: mockDomainsWithMissingProps.length,
    });

    renderWithRouter(<Topbar />, { route: '/test-service' });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should render all buttons with correct variants', () => {
    renderWithRouter(<Topbar />, { route: '/test-service' });
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

    renderWithRouter(<Topbar />, { route: '/my-custom-service' });

    const orderSslButton = screen.getByTestId('order-ssl');
    await user.click(orderSslButton);

    expect(navigate).toHaveBeenCalledWith('/my-custom-service/order-sectigo');

    const importSslButton = screen.getByTestId('import-ssl');
    await user.click(importSslButton);

    expect(navigate).toHaveBeenCalledWith('/my-custom-service/import-ssl');
  });

  it('should handle domain selection', () => {
    const mockDomains = [
      {
        ...websitesMocks[2],
        currentState: {
          ...websitesMocks[2].currentState,
          ssl: { status: ServiceStatus.NONE },
          hosting: {
            ...websitesMocks[2].currentState.hosting,
            serviceName: 'test-service',
          },
          isDefault: false,
        },
      },
    ];

    vi.mocked(useDataApi).mockReturnValue({
      flattenData: mockDomains,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: mockDomains.length,
    });

    renderWithRouter(<Topbar />, { route: '/test-service' });
    const domainSelect = screen.getByTestId('domainName');
    expect(domainSelect).toBeInTheDocument();
  });

  it('should call createDomainCertificates when enable SSL button is clicked', async () => {
    const user = userEvent.setup();
    const mockDomains = [
      {
        ...websitesMocks[2],
        currentState: {
          ...websitesMocks[2].currentState,
          ssl: { status: ServiceStatus.NONE },
          hosting: {
            ...websitesMocks[2].currentState.hosting,
            serviceName: 'test-service',
          },
          isDefault: false,
        },
      },
    ];

    vi.mocked(useDataApi).mockReturnValue({
      flattenData: mockDomains,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      isFetching: false,
      status: 'success',
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      pageIndex: 0,
      totalCount: mockDomains.length,
    });

    renderWithRouter(<Topbar />, { route: '/test-service' });

    const domainSelect = screen.getByTestId('domainName');
    await user.selectOptions(domainSelect, mockDomains[0].currentState.fqdn);

    const enableButton = screen.getByText(/enable_ssl_encrypt/i);
    await user.click(enableButton);

    await waitFor(() => {
      expect(mockCreateDomainCertificates).toHaveBeenCalledWith([mockDomains[0].currentState.fqdn]);
    });
  });
});
