import '@/common/setupTests';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, beforeEach } from 'vitest';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';
import {
  useGetDomainResource,
  useGetDomainContact,
} from '@/domain/hooks/data/query';
import HolderCards from './HolderCard';
import {
  domainContactCorporation,
  domainContactIndividual,
} from '@/domain/__mocks__/contact';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainResource: vi.fn(),
  useGetDomainContact: vi.fn(),
}));

describe('HolderCards Component', () => {
  const mockServiceName = 'example.com';
  const mockContactID = 'CONTACT123';

  beforeEach(() => {
    vi.clearAllMocks();
    (useGetDomainResource as jest.Mock).mockReturnValue({
      domainResource: {
        currentState: {
          contactsConfiguration: {
            contactOwner: { id: mockContactID },
          },
        },
      },
    });
  });

  it('should render spinner when contact is loading', () => {
    (useGetDomainContact as jest.Mock).mockReturnValue({
      domainContact: null,
    });

    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isAuthorized: true,
    });

    render(<HolderCards serviceName={mockServiceName} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render placeholder message when not admin connected', () => {
    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isAuthorized: false,
    });

    render(<HolderCards serviceName={mockServiceName} />);

    expect(
      screen.getByText(
        'domain_tab_contact_management_holder_placeholder_personal_informations',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render contact information when admin connected', () => {
    (useGetDomainContact as jest.Mock).mockReturnValue({
      domainContact: domainContactIndividual,
    });

    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isAuthorized: true,
    });

    render(<HolderCards serviceName={mockServiceName} />);

    expect(
      screen.getByText(
        'domain_tab_contact_management_holder_title (CONTACT123)',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('firstname lastname')).toBeInTheDocument();
    expect(
      screen.getByText('2 Rue Kellermann 59100 ROUBAIX'),
    ).toBeInTheDocument();
    expect(screen.getByText('example@example.com')).toBeInTheDocument();
    expect(screen.getByText('+33.612345679')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('should navigate to edit contact URL when button is clicked', () => {
    (useGetDomainContact as jest.Mock).mockReturnValue({
      domainContact: domainContactIndividual,
    });

    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isAuthorized: true,
    });

    render(<HolderCards serviceName={mockServiceName} />);

    fireEvent.click(screen.getByRole('button'));
  });

  it('should display organization information for non-individual legal form', () => {
    (useGetDomainContact as jest.Mock).mockReturnValue({
      domainContact: domainContactCorporation,
    });
    (useAuthorizationIam as jest.Mock).mockReturnValue({
      isAuthorized: true,
    });

    render(<HolderCards serviceName={mockServiceName} />);

    expect(screen.getByText('OVHCloud')).toBeInTheDocument();
    expect(screen.getByText('FR123456789')).toBeInTheDocument();
    expect(screen.getByText('FRVAT123456')).toBeInTheDocument();
  });
});
