import { render, screen } from '@/common/utils/test.provider';
import { describe, it, expect } from 'vitest';
import Subscription from './Subscription';
import { TServiceInfo } from '@/common/types/common.types';

const mockContacts: TServiceInfo['customer']['contacts'] = [
  { customerCode: 'admin-001', type: 'administrator' },
  { customerCode: 'tech-001', type: 'technical' },
  { customerCode: 'billing-001', type: 'billing' },
];

describe('Subscription', () => {
  const defaultProps = {
    creationDate: '2023-01-15T10:00:00Z',
    expirationDate: '2024-01-15T10:00:00Z',
    contacts: mockContacts,
    serviceName: 'service-test-001',
  };

  it('should render without crashing', () => {
    const { container } = render(<Subscription {...defaultProps} />);
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    render(<Subscription {...defaultProps} />);
    expect(screen.getByText('subscription')).toBeInTheDocument();
  });

  it('should display the expiration date label', () => {
    render(<Subscription {...defaultProps} />);
    expect(
      screen.getByText(
        'domain:domain_tab_general_information_subscription_expiration_date',
      ),
    ).toBeInTheDocument();
  });

  it('should display the renew mode label', () => {
    render(<Subscription {...defaultProps} />);
    expect(
      screen.getByText('domain-reseller:domain_reseller_renew_mode_label'),
    ).toBeInTheDocument();
  });

  it('should display the automatic renew mode badge', () => {
    render(<Subscription {...defaultProps} />);
    expect(
      screen.getByText('domain-reseller:domain_reseller_renew_mode_automatic'),
    ).toBeInTheDocument();
  });

  it('should render CreationDate component', () => {
    render(<Subscription {...defaultProps} />);
    expect(screen.getByText('creation_date')).toBeInTheDocument();
  });

  it('should render Contacts component', () => {
    render(<Subscription {...defaultProps} />);
    expect(
      screen.getByText('@ovh-ux/manager-common-translations/contact:contact'),
    ).toBeInTheDocument();
    expect(screen.getByText(/admin-001/)).toBeInTheDocument();
  });
});
