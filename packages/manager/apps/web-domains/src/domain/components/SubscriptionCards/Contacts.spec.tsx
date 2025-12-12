import '@/common/setupTests';
import React from 'react';
import { render, screen, waitFor } from '@/common/utils/test.provider';
import { vi } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import Contacts from '@/domain/components/SubscriptionCards/Contacts';
import { domainResourceOK } from '@/domain/__mocks__/serviceInfoDetail';
import { useGetDomainContact } from '@/domain/hooks/data/query';
import { domainContactIndividual } from '@/domain/__mocks__/contact';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainContact: vi.fn(),
}));

describe('Contacts component', () => {
  it('renders populated state with contacts information', async () => {
    (useGetDomainContact as jest.Mock).mockReturnValue({
      domainResource: null,
      isFetchingDomainResource: true,
    });
    render(
      <Contacts
        domainResource={domainResourceOK}
        serviceName="example.com"
        domainContact={domainContactIndividual}
        isFetchingDomainContact={false}
      />,
      { wrapper },
    );

    await waitFor(() => {
      expect(screen.getByText(/contacts/i)).toBeInTheDocument();
      expect(
        screen.getByText(
          /firstname lastname: domain_tab_general_information_subscription_contact_owner/i,
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
