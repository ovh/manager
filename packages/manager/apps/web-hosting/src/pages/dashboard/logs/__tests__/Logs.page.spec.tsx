import React from 'react';

import * as reactRouterDom from 'react-router-dom';

import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { webHostingMock } from '@/data/__mocks__/webHostingDashboard';
import { renderWithRouter } from '@/utils/test.provider';

import LogsPage from '../Logs.page';

// Mock the hooks and components
const mockUseGetHostingService = vi.fn();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockLogsToCustomerModule = vi.fn((_props: unknown) => (
  <div data-testid="logs-to-customer-module">LogsToCustomerModule</div>
));
const mockUseParams = vi.fn();

vi.mock('@/data/hooks/webHostingDashboard/useWebHostingDashboard', () => ({
  useGetHostingService: (serviceName: string) =>
    mockUseGetHostingService(serviceName) as {
      data: unknown;
      isPending: boolean;
      error: unknown;
    },
}));

vi.mock('@ovh-ux/logs-to-customer', () => ({
  LogsToCustomerModule: (props: unknown) => mockLogsToCustomerModule(props),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof reactRouterDom>('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams() as { serviceName?: string },
  };
});

describe('LogsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ serviceName: 'test-service' });
  });

  it('should render loading state when data is pending', () => {
    mockUseGetHostingService.mockReturnValue({
      data: null,
      isPending: true,
    });

    const { queryByTestId } = renderWithRouter(<LogsPage />, {
      route: '/test-service/user-logs',
    });

    expect(queryByTestId('spinner')).toBeInTheDocument();
    expect(queryByTestId('logs-to-customer-module')).not.toBeInTheDocument();
  });

  it('should return null when hosting is not available', () => {
    mockUseGetHostingService.mockReturnValue({
      data: null,
      isPending: false,
    });

    const { container } = renderWithRouter(<LogsPage />, {
      route: '/test-service/user-logs',
    });

    expect(container.firstChild).toBeNull();
  });

  it('should return null when serviceName is not available', () => {
    mockUseParams.mockReturnValue({ serviceName: undefined });
    mockUseGetHostingService.mockReturnValue({
      data: webHostingMock,
      isPending: false,
    });

    const { container } = renderWithRouter(<LogsPage />, {
      route: '/user-logs',
    });

    expect(container.firstChild).toBeNull();
  });

  it('should render LogsToCustomerModule with correct props when hosting is available', async () => {
    mockUseGetHostingService.mockReturnValue({
      data: webHostingMock,
      isPending: false,
    });

    renderWithRouter(<LogsPage />, {
      route: '/test-service/user-logs',
    });

    await waitFor(() => {
      expect(mockLogsToCustomerModule).toHaveBeenCalled();
    });

    const callArgs = mockLogsToCustomerModule.mock.calls[0]?.[0];
    expect(callArgs).toBeDefined();
    expect(callArgs).toMatchObject({
      logApiVersion: 'v6',
      logApiUrls: {
        logKind: '/hosting/web/test-service/log/kind',
        logSubscription: '/hosting/web/test-service/log/subscription',
        logUrl: '/hosting/web/test-service/log/url',
      },
      logIamActions: {
        postSubscription: ['hosting:apiovh:log/subscription/create'],
        deleteSubscription: ['hosting:apiovh:log/subscription/delete'],
      },
      resourceURN: 'string', // From webHostingMock.iam.urn
      trackingOptions: {
        trackingSuffix: 'web-hosting',
      },
    });
  });

  it('should use fallback resourceURN when IAM URN is not available', async () => {
    const hostingWithoutIam = {
      ...webHostingMock,
      iam: undefined,
    };

    mockUseGetHostingService.mockReturnValue({
      data: hostingWithoutIam,
      isPending: false,
    });

    renderWithRouter(<LogsPage />, {
      route: '/test-service/user-logs',
    });

    await waitFor(() => {
      expect(mockLogsToCustomerModule).toHaveBeenCalled();
    });

    const callArgs = mockLogsToCustomerModule.mock.calls[0]?.[0] as {
      resourceURN?: string;
    };
    expect(callArgs).toBeDefined();
    expect(callArgs?.resourceURN).toBe('urn:v1:eu:resource:webHosting:test-service');
  });

  it('should use IAM URN when available', async () => {
    const hostingWithIam = {
      ...webHostingMock,
      iam: {
        ...webHostingMock.iam,
        urn: 'urn:v1:eu:resource:webHosting:custom-urn',
      },
    };

    mockUseGetHostingService.mockReturnValue({
      data: hostingWithIam,
      isPending: false,
    });

    renderWithRouter(<LogsPage />, {
      route: '/test-service/user-logs',
    });

    await waitFor(() => {
      expect(mockLogsToCustomerModule).toHaveBeenCalled();
    });

    const callArgs = mockLogsToCustomerModule.mock.calls[0]?.[0] as {
      resourceURN?: string;
    };
    expect(callArgs).toBeDefined();
    expect(callArgs?.resourceURN).toBe('urn:v1:eu:resource:webHosting:custom-urn');
  });

  it('should call useGetHostingService with correct serviceName', () => {
    mockUseParams.mockReturnValue({ serviceName: 'my-service' });
    mockUseGetHostingService.mockReturnValue({
      data: webHostingMock,
      isPending: false,
    });

    renderWithRouter(<LogsPage />, {
      route: '/my-service/user-logs',
    });

    expect(mockUseGetHostingService).toHaveBeenCalledWith('my-service');
  });
});
