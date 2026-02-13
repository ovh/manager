import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DomainResellerDashboard from './DomainResellerDashboard';
import * as utils from '@/common/utils/utils';

vi.mock('@/common/hooks/environment/data', () => ({
  useGetEnvironmentData: vi.fn(() => ({
    region: 'EU',
    ovhSubsidiary: 'FR',
  })),
}));

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformationByRoutes: vi.fn(() => ({
    serviceInfo: {
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
        renew: {
          current: {
            mode: 'automatic',
          },
        },
      },
      resource: {
        name: 'domain-reseller-service-001',
      },
    },
    isServiceInfoLoading: false,
  })),
}));

vi.mock('@/domain-reseller/hooks/data/query', () => ({
  useGetDomainsList: vi.fn(() => ({
    data: ['domain1.com', 'domain2.com', 'domain3.com'],
    isLoading: false,
    isFetching: false,
  })),
}));

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual('@ovh-ux/muk');
  return {
    ...actual,
    useFormatDate: () => ({ date }: { date: string }) =>
      new Date(date).toLocaleDateString(),
  };
});

describe('DomainResellerDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(<DomainResellerDashboard />);
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    render(<DomainResellerDashboard />);
    expect(screen.getByText('domain_reseller_title')).toBeInTheDocument();
  });

  it('should display information message', () => {
    render(<DomainResellerDashboard />);
    expect(
      screen.getByText('domain_reseller_message_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_message_text'),
    ).toBeInTheDocument();
  });

  it('should display action buttons', () => {
    render(<DomainResellerDashboard />);
    expect(
      screen.getByText('domain_reseller_button_add_domain'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_button_download_catalog'),
    ).toBeInTheDocument();
  });

  it('should call handleOrderClick when add domain button is clicked', () => {
    const handleOrderClickSpy = vi.spyOn(utils, 'handleOrderClick');
    render(<DomainResellerDashboard />);

    const addButton = screen.getByText('domain_reseller_button_add_domain');
    addButton.click();

    expect(handleOrderClickSpy).toHaveBeenCalledWith(
      'https://order.eu.ovhcloud.com/fr',
    );
  });

  it('should display GeneralInformations component', () => {
    render(<DomainResellerDashboard />);
    expect(
      screen.getByText('domain_reseller_general_informations_label'),
    ).toBeInTheDocument();
  });

  it('should display the correct number of domains in GeneralInformations', () => {
    render(<DomainResellerDashboard />);
    expect(
      screen.getByText('domain_reseller_general_informations_domains_length'),
    ).toBeInTheDocument();
  });
});
