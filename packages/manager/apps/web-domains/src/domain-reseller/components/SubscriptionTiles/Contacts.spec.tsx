import { render, screen } from '@testing-library/react';
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
    expect(screen.getByText('contact')).toBeInTheDocument();
  });

  it('should display all contacts', () => {
    render(<Contacts {...defaultProps} />);
    expect(screen.getByText(/admin-001/)).toBeInTheDocument();
    expect(screen.getByText(/tech-001/)).toBeInTheDocument();
    expect(screen.getByText(/billing-001/)).toBeInTheDocument();
  });

  it('should display contact types', () => {
    render(<Contacts {...defaultProps} />);
    expect(screen.getByText(/: administrator/)).toBeInTheDocument();
    expect(screen.getByText(/: technical/)).toBeInTheDocument();
    expect(screen.getByText(/: billing/)).toBeInTheDocument();
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
    expect(screen.getByText('contact')).toBeInTheDocument();
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
