import { vi } from 'vitest';
import '@/common/setupTests';
import { render, screen, waitFor, wrapper } from '@/common/utils/test.provider';
import SubscriptionCards from '@/domain/components/SubscriptionCards/SubscriptionCards';
import {
  useGetDomainContact,
  useGetDomainResource,
} from '@/domain/hooks/data/query';
import { domainResourceOK } from '@/domain/__mocks__/serviceInfoDetail';
import { serviceInfoPremium } from '@/domain/__mocks__/serviceInfo';
import { useGetServiceInformation } from '@/common/hooks/data/query';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
  useGetDomainContact: vi.fn(),
}));

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformation: vi.fn(),
}));

describe('SubscriptionCards component', () => {
  it('renders loading state when data is fetching', () => {
    vi.mocked(useGetDomainResource).mockReturnValue({
      domainResource: null,
      isFetchingDomainResource: true,
      domainResourceError: null,
    } as ReturnType<typeof useGetDomainResource>);
    vi.mocked(useGetServiceInformation).mockReturnValue({
      isServiceInfoLoading: true,
      serviceInfo: null,
    } as ReturnType<typeof useGetServiceInformation>);
    vi.mocked(useGetDomainContact).mockReturnValue({
      isFetchingDomainContact: true,
      domainContact: null,
      domainContactError: null,
    } as ReturnType<typeof useGetDomainContact>);

    render(<SubscriptionCards serviceName="example.com" />, { wrapper });
    const skeletons = document.querySelectorAll('[data-ods="skeleton"]');

    expect(
      screen.getByText(
        '@ovh-ux/manager-common-translations/billing:subscription',
      ),
    ).toBeInTheDocument();
    expect(skeletons).toHaveLength(4);
  });

  it('renders populated state with domain information', async () => {
    vi.mocked(useGetDomainResource).mockReturnValue({
      domainResource: domainResourceOK,
      isFetchingDomainResource: false,
      domainResourceError: null,
    } as ReturnType<typeof useGetDomainResource>);
    vi.mocked(useGetServiceInformation).mockReturnValue({
      isServiceInfoLoading: false,
      serviceInfo: serviceInfoPremium,
    } as ReturnType<typeof useGetServiceInformation>);
    vi.mocked(useGetDomainContact).mockReturnValue({
      isFetchingDomainContact: false,
      domainContact: {
        firstName: 'Example',
        lastName: 'Contact',
        organisationName: '',
      },
      domainContactError: null,
    } as ReturnType<typeof useGetDomainContact>);

    render(<SubscriptionCards serviceName="example.com" />, { wrapper });

    await waitFor(() => {
      expect(
        screen.getByText(
          '@ovh-ux/manager-common-translations/billing:subscription',
        ),
      ).toBeInTheDocument();
      expect(screen.getByText(/1 janv\. 2023/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /domain_tab_general_information_subscription_renew_frequency_year/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /domain_tab_general_information_subscription_premium_value/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /Example Contact: domain_tab_general_information_subscription_contact_owner/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /admin-id: domain_tab_general_information_subscription_contact_administrator/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /tech-id: domain_tab_general_information_subscription_contact_technical/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /billing-id: domain_tab_general_information_subscription_contact_billing/i,
        ),
      ).toBeInTheDocument();
    });
  });
});
