import { vi } from 'vitest';
import '@/common/setupTests';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { wrapper } from '@/common/utils/test.provider';
import SubscriptionCards from '@/domain/components/SubscriptionCards/SubscriptionCards';
import {
  useGetDomainContact,
  useGetDomainResource,
  useGetServiceInformation,
} from '@/domain/hooks/data/query';
import { domainResourceOK } from '@/domain/__mocks__/serviceInfoDetail';
import { serviceInfoPremium } from '@/domain/__mocks__/serviceInfo';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
  useGetServiceInformation: vi.fn(),
  useGetDomainContact: vi.fn(),
}));

describe('SubscriptionCards component', () => {
  it('renders loading state when data is fetching', () => {
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: null,
      isFetchingDomainResource: true,
    });
    (useGetServiceInformation as jest.Mock).mockReturnValue({
      isServiceInfoLoading: true,
      serviceInfo: null,
    });
    (useGetDomainContact as jest.Mock).mockReturnValue({
      isFetchingDomainContact: true,
      domainContact: true,
    });

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
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: domainResourceOK,
      isFetchingDomainResource: false,
    });
    (useGetServiceInformation as jest.Mock).mockReturnValue({
      isServiceInfoLoading: false,
      serviceInfo: serviceInfoPremium,
    });
    (useGetDomainContact as jest.Mock).mockReturnValue({
      isFetchingDomainContact: true,
      domainContact: true,
    });

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
          /owner-id: domain_tab_general_information_subscription_contact_owner/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /admin-id: domain_tab_general_information_subscription_contact_technical/i,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /tech-id: domain_tab_general_information_subscription_contact_administrator/i,
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
