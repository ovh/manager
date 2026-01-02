import React, { ComponentType } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, vi } from 'vitest';

import { attachedDomainDigStatusMock } from '@/data/__mocks__';
import { GitStatus, ResourceStatus, ServiceStatus } from '@/data/types/status';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { createWrapper, i18n } from '@/utils/test.provider';

import { BadgeStatusCell, DiagnosticCell, LinkCell } from '../Cells.component';

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

const RouterWrapper = createWrapper();

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
  useWebHostingAttachedDomaindigStatus: vi.fn(),
  useGenerateUrl: vi.fn(),
  useHostingUrl: vi.fn(),
  useOvhTracking: vi.fn(),
}));

vi.mock(
  '@/data/hooks/webHostingAttachedDomaindigStatus/useWebHostingAttachedDomaindigStatus',
  () => {
    return {
      useWebHostingAttachedDomaindigStatus: hoistedMock.useWebHostingAttachedDomaindigStatus,
    };
  },
);

vi.mock('@/hooks/generateUrl/useGenerateUrl', () => {
  return {
    useGenerateUrl: hoistedMock.useGenerateUrl,
  };
});

vi.mock('@/hooks/useHostingUrl', () => {
  return {
    useHostingUrl: hoistedMock.useHostingUrl,
  };
});

describe('DiagnosticCell', () => {
  beforeEach(() => {
    hoistedMock.useWebHostingAttachedDomaindigStatus.mockReturnValue({
      data: attachedDomainDigStatusMock,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    hoistedMock.useGenerateUrl.mockReturnValue('/test-url');
    hoistedMock.useHostingUrl.mockReturnValue('/hosting-url');
    hoistedMock.useOvhTracking.mockReturnValue({ trackClick: vi.fn() });
  });

  it('should render diagnostic cell correctly', () => {
    render(
      <DiagnosticCell serviceName="test-service" fqdn="test.example.com" isWebsiteView={false} />,
      { wrapper: Wrappers as ComponentType },
    );

    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('AAAA')).toBeInTheDocument();
  });

  it('should render diagnostic cell with website view correctly', () => {
    render(
      <DiagnosticCell serviceName="test-service" fqdn="test.example.com" isWebsiteView={true} />,
      { wrapper: Wrappers as ComponentType },
    );

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should handle error state correctly', () => {
    hoistedMock.useWebHostingAttachedDomaindigStatus.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    });

    render(
      <DiagnosticCell serviceName="test-service" fqdn="test.example.com" isWebsiteView={false} />,
      { wrapper: Wrappers as ComponentType },
    );

    expect(
      screen.getByText(commonTranslation.web_hosting_status_diagnostic_error),
    ).toBeInTheDocument();
  });
});

describe('BadgeStatusCell', () => {
  beforeEach(() => {
    hoistedMock.useGenerateUrl.mockReturnValue('/test-url');
    hoistedMock.useHostingUrl.mockReturnValue('/hosting-url');
  });

  it('should render badge status cell correctly', () => {
    const mockItem = {
      id: '1',
      checksum: '',
      currentState: {
        fqdn: 'test.site',
        firewall: { status: ServiceStatus.NONE },
        cdn: { status: ServiceStatus.ACTIVE },
        name: 'deuxieme site',
        path: 'testsuppression',
        websiteId: '1',
      },
      currentTasks: [],
      resourceStatus: ResourceStatus.READY,
      targetSpec: {
        firewall: ServiceStatus.NONE,
        cdn: ServiceStatus.ACTIVE,
      },
    };

    render(
      <BadgeStatusCell
        webSiteItem={mockItem}
        status={ServiceStatus.ACTIVE}
        tracking="test-tracking"
      />,
      {
        wrapper: Wrappers as ComponentType,
      },
    );

    expect(screen.getByTestId('badge-status-ACTIVE')).toBeInTheDocument();
  });
});
describe('LinkCell', () => {
  beforeEach(() => {
    hoistedMock.useGenerateUrl.mockReturnValue('/test-url');
    hoistedMock.useHostingUrl.mockReturnValue('/hosting-url');
    hoistedMock.useOvhTracking.mockReturnValue({ trackClick: vi.fn() });
  });

  it('should render link cell correctly', () => {
    const mockItem = {
      id: '1',
      currentState: {
        resourceStatus: ResourceStatus.READY,
        fqdn: 'example.com',
        path: '/www',
        cdn: { status: ServiceStatus.ACTIVE },
        firewall: { status: ServiceStatus.ACTIVE },
        git: {
          status: GitStatus.CREATED,
          vcsBranch: 'main',
          vcsUrl: 'https://github.com/ovh/manager',
        },
        ssl: { status: ServiceStatus.ACTIVE },
        hosting: {
          displayName: 'example.com',
          offer: 'hosting-performance-1',
          serviceName: 'example.cluster023.hosting.ovh.net',
          boostOffer: 'boost',
        },
        ownLog: 'true',
      },
      currentTasks: [],
    };

    render(<LinkCell webSiteItem={mockItem} label="Test Link" tracking="test-tracking" />, {
      wrapper: Wrappers as ComponentType,
    });

    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });
});
