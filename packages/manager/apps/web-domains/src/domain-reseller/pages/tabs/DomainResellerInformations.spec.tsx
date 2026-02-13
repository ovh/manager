import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DomainResellerInformations from './DomainResellerInformations';
import * as utils from '@/common/utils/utils';
import { useGetServiceInformationByRoutes } from '@/common/hooks/data/query';
import { useGetDomainsListByNicBilling } from '@/domain-reseller/hooks/data/query';

const mockServiceInfo = {
  customer: {
    contacts: [
      { type: 'administrator', customerCode: 'admin-001' },
      { type: 'technical', customerCode: 'tech-001' },
      { type: 'billing', customerCode: 'billing-001' },
    ],
  },
  billing: {
    lifecycle: {
      current: {
        creationDate: '2023-01-15T10:00:00Z',
      },
    },
    expirationDate: '2024-01-15T10:00:00Z',
  },
  resource: {
    name: 'domain-reseller-service-001',
  },
};

const mockDomainsList = ['domain1.com', 'domain2.com', 'domain3.com'];

vi.mock('@/common/hooks/environment/data', () => ({
  useGetEnvironmentData: vi.fn(() => ({
    region: 'EU',
    ovhSubsidiary: 'FR',
  })),
}));

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformationByRoutes: vi.fn(() => ({
    serviceInfo: mockServiceInfo,
    isServiceInfoLoading: false,
  })),
}));

vi.mock('@/domain-reseller/hooks/data/query', () => ({
  useGetDomainsListByNicBilling: vi.fn(() => ({
    data: mockDomainsList,
    isLoading: false,
  })),
  useGetDomainsListByExcludedNicBilling: vi.fn(() => ({
    data: [],
    isLoading: false,
  })),
  useUpdateDomainNicbilling: vi.fn(() => ({
    mutate: vi.fn(),
    isPending: false,
  })),
}));

vi.mock('@/domain-reseller/components/Dashboard/GeneralInformations', () => ({
  default: ({ domainsLength }: { domainsLength: number }) => (
    <div data-testid="general-informations">Domains: {domainsLength}</div>
  ),
}));

vi.mock('@/domain-reseller/components/Dashboard/Subscription', () => ({
  default: ({ creationDate, expirationDate, serviceName }: any) => (
    <div data-testid="subscription">
      <div>Service: {serviceName}</div>
      <div>Created: {creationDate}</div>
      <div>Expires: {expirationDate}</div>
    </div>
  ),
}));

vi.mock('@/domain/components/Loading/Loading', () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}));

describe('DomainResellerInformations', () => {
  const handleOrderClickSpy = vi.spyOn(utils, 'handleOrderClick');

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);
    vi.mocked(useGetDomainsListByNicBilling).mockReturnValue({
      data: mockDomainsList,
      isLoading: false,
    } as ReturnType<typeof useGetDomainsListByNicBilling>);
  });

  it('should render without crashing', () => {
    const { container } = render(<DomainResellerInformations />);
    expect(container).toBeInTheDocument();
  });

  it('should display loading state when service info is loading', () => {
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);

    render(<DomainResellerInformations />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should display loading state when domains list is loading', () => {
    vi.mocked(useGetDomainsListByNicBilling).mockReturnValue({
      data: [],
      isLoading: true,
    } as ReturnType<typeof useGetDomainsListByNicBilling>);

    render(<DomainResellerInformations />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render the main section', () => {
    render(<DomainResellerInformations />);
    expect(
      screen.getByTestId('domain-reseller-informations'),
    ).toBeInTheDocument();
  });

  it('should display the information message', () => {
    render(<DomainResellerInformations />);
    expect(screen.getByTestId('info-message')).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_message_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_message_text'),
    ).toBeInTheDocument();
  });

  it('should display add domain button', () => {
    render(<DomainResellerInformations />);
    const addButton = screen.getByTestId('add-domain-button');
    expect(addButton).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_button_add_domain'),
    ).toBeInTheDocument();
  });

  it('should call handleOrderClick when add domain button is clicked', () => {
    render(<DomainResellerInformations />);
    const addButton = screen.getByTestId('add-domain-button');

    fireEvent.click(addButton);

    expect(handleOrderClickSpy).toHaveBeenCalledWith(
      'https://order.eu.ovhcloud.com/fr',
    );
  });

  it('should display dashboard grid with two columns', () => {
    render(<DomainResellerInformations />);
    expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument();
  });

  it('should render GeneralInformations with correct domains count', () => {
    render(<DomainResellerInformations />);
    expect(screen.getByTestId('general-informations')).toBeInTheDocument();
    expect(screen.getByText('Domains: 3')).toBeInTheDocument();
  });

  it('should render Subscription with service info', () => {
    render(<DomainResellerInformations />);
    expect(screen.getByTestId('subscription')).toBeInTheDocument();
    expect(
      screen.getByText('Service: domain-reseller-service-001'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Created: 2023-01-15T10:00:00Z'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Expires: 2024-01-15T10:00:00Z'),
    ).toBeInTheDocument();
  });

  it('should handle empty domains list', () => {
    vi.mocked(useGetDomainsListByNicBilling).mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof useGetDomainsListByNicBilling>);

    render(<DomainResellerInformations />);
    expect(screen.getByText('Domains: 0')).toBeInTheDocument();
  });
});
