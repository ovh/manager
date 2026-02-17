import { render, screen } from '@/common/utils/test.provider';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DomainResellerInformation from './DomainResellerInformation';
import * as utils from '@/common/utils/utils';
import { useGetServiceInformationByRoutes } from '@/common/hooks/data/query';
import { useGetDomainsList } from '@/domain-reseller/hooks/data/query';
import { mockServiceInfoReseller } from '@/domain/__mocks__/serviceInfo';

const mockDomainsList = ['domain1.com', 'domain2.com', 'domain3.com'];

vi.mock('@/common/hooks/environment/data', () => ({
  useGetEnvironmentData: vi.fn(() => ({
    region: 'EU',
    ovhSubsidiary: 'FR',
  })),
}));

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformationByRoutes: vi.fn(() => ({
    serviceInfo: mockServiceInfoReseller,
    isServiceInfoLoading: false,
  })),
}));

vi.mock('@/domain-reseller/hooks/data/query', () => ({
  useGetDomainsList: vi.fn(() => ({
    data: mockDomainsList,
    isLoading: false,
  })),
}));

describe('DomainResellerInformation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: mockServiceInfoReseller,
      isServiceInfoLoading: false,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);
    vi.mocked(useGetDomainsList).mockReturnValue({
      data: mockDomainsList,
      isLoading: false,
    } as ReturnType<typeof useGetDomainsList>);
  });

  it('should render without crashing', () => {
    const { container } = render(<DomainResellerInformation />);
    expect(container).toBeInTheDocument();
  });

  it('should display loading state when service info is loading', () => {
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);

    render(<DomainResellerInformation />);
    expect(
      screen.queryByTestId('domain-reseller-informations'),
    ).not.toBeInTheDocument();
  });

  it('should display loading state when domains list is loading', () => {
    vi.mocked(useGetDomainsList).mockReturnValue({
      data: [],
      isLoading: true,
    } as ReturnType<typeof useGetDomainsList>);

    render(<DomainResellerInformation />);
    expect(
      screen.queryByTestId('domain-reseller-informations'),
    ).not.toBeInTheDocument();
  });

  it('should render the main section', () => {
    render(<DomainResellerInformation />);
    expect(
      screen.getByTestId('domain-reseller-informations'),
    ).toBeInTheDocument();
  });

  it('should display the information message', () => {
    render(<DomainResellerInformation />);
    expect(screen.getByTestId('info-message')).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_message_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_message_text'),
    ).toBeInTheDocument();
  });

  it('should display add domain button', () => {
    render(<DomainResellerInformation />);
    expect(screen.getByTestId('add-domain-button')).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_button_add_domain'),
    ).toBeInTheDocument();
  });

  it('should call handleOrderClick when add domain button is clicked', () => {
    const handleOrderClickSpy = vi.spyOn(utils, 'handleOrderClick');
    render(<DomainResellerInformation />);

    screen.getByTestId('add-domain-button').click();

    expect(handleOrderClickSpy).toHaveBeenCalled();
  });

  it('should display download catalog button', () => {
    render(<DomainResellerInformation />);
    expect(screen.getByTestId('download-catalog-button')).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_button_download_catalog'),
    ).toBeInTheDocument();
  });

  it('should display dashboard grid', () => {
    render(<DomainResellerInformation />);
    expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument();
  });
});
