import '@/common/setupTests';
import { render, screen, waitFor, wrapper } from '@/common/utils/test.provider';
import { Mock, vi } from 'vitest';
import Contacts from '@/domain/components/SubscriptionCards/Contacts';
import { domainResourceOK } from '@/domain/__mocks__/serviceInfoDetail';
import { useGetDomainContact } from '@/domain/hooks/data/query';
import { domainContactIndividual } from '@/domain/__mocks__/contact';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainContact: vi.fn(),
}));

describe('Contacts component', () => {
  it('renders populated state with contacts information', async () => {
    (useGetDomainContact as Mock).mockReturnValue({
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
