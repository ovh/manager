import { render, screen } from '@/common/utils/test.provider';
import { describe, it, expect } from 'vitest';
import Contacts from './Contacts';
import { TServiceInfo } from '@/common/types/common.types';

const mockContacts: TServiceInfo['customer']['contacts'] = [
  { customerCode: 'admin-001', type: 'administrator' },
  { customerCode: 'tech-001', type: 'technical' },
  { customerCode: 'billing-001', type: 'billing' },
];

describe('Contacts', () => {
  const defaultProps = {
    contacts: mockContacts,
    serviceName: 'service-test-001',
  };

  it('should render without crashing', () => {
    const { container } = render(<Contacts {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('should display the contact label', () => {
    render(<Contacts {...defaultProps} />);
    expect(
      screen.getByText('@ovh-ux/manager-common-translations/contact:contacts'),
    ).toBeInTheDocument();
  });

  it('should display contact types', () => {
    render(<Contacts {...defaultProps} />);
    expect(
      screen.getByText(
        /domain_tab_general_information_subscription_contact_administrator/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /domain_tab_general_information_subscription_contact_technical/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /domain_tab_general_information_subscription_contact_billing/,
      ),
    ).toBeInTheDocument();
  });

  it('should render ActionMenu with manage contacts link', () => {
    render(<Contacts {...defaultProps} />);
    const links = screen.getAllByRole('link');
    const button = links.find((link) =>
      link.querySelector('[label*="handle_contacts"]'),
    );
    expect(button).toBeDefined();
  });

  it('should handle empty contacts list', () => {
    const emptyProps = {
      contacts: [] as TServiceInfo['customer']['contacts'],
      serviceName: 'service-test-001',
    };
    const { container } = render(<Contacts {...emptyProps} />);
    expect(container).toBeInTheDocument();
    expect(
      screen.getByText('@ovh-ux/manager-common-translations/contact:contacts'),
    ).toBeInTheDocument();
  });

  it('should display a single contact correctly', () => {
    const singleContactProps = {
      contacts: [{ customerCode: 'single-001', type: 'owner' }],
      serviceName: 'service-test-001',
    };
    render(<Contacts {...singleContactProps} />);
    expect(screen.getByText(/single-001/)).toBeInTheDocument();
    expect(screen.getByText(/owner/)).toBeInTheDocument();
  });
});
