import '@/common/setupTests';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { wrapper } from '@/common/utils/test.provider';
import AssociatedServicesCards from '@/domain/components/AssociatedServicesCards/AssociatedServicesCards';

vi.mock('./Emails', () => ({
  default: () => <div data-testid="emails-component">Emails Component</div>,
}));

vi.mock('./Hosting', () => ({
  default: () => <div data-testid="hosting-component">Hosting Component</div>,
}));

vi.mock('./SubDomainsMultiSite', () => ({
  default: () => (
    <div data-testid="subdomains-multisite-component">
      SubDomains MultiSite Component
    </div>
  ),
}));

vi.mock('@/domain/hooks/data/query', () => ({
  useGetAssociatedHosting: vi.fn(() => ({
    data: ['hosting1.com', 'hosting2.com'],
  })),
}));

describe('AssociatedServicesCards component', () => {
  it('should render the component with title', () => {
    render(<AssociatedServicesCards serviceName="example.com" />, { wrapper });

    expect(
      screen.getByText(
        'domain_tab_general_information_associated_services_title',
      ),
    ).toBeInTheDocument();
  });

  it('should render Hosting component', () => {
    render(<AssociatedServicesCards serviceName="example.com" />, { wrapper });

    expect(screen.getByTestId('hosting-component')).toBeInTheDocument();
    expect(screen.getByText('Hosting Component')).toBeInTheDocument();
  });

  it('should render Emails component', () => {
    render(<AssociatedServicesCards serviceName="example.com" />, { wrapper });

    expect(screen.getByTestId('emails-component')).toBeInTheDocument();
    expect(screen.getByText('Emails Component')).toBeInTheDocument();
  });

  it('should render SubDomainsMultiSite component', () => {
    render(<AssociatedServicesCards serviceName="example.com" />, { wrapper });

    expect(
      screen.getByTestId('subdomains-multisite-component'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('SubDomains MultiSite Component'),
    ).toBeInTheDocument();
  });

  it('should pass serviceName prop to child components', () => {
    render(<AssociatedServicesCards serviceName="test-domain.com" />, {
      wrapper,
    });

    expect(screen.getByTestId('hosting-component')).toBeInTheDocument();
    expect(
      screen.getByTestId('subdomains-multisite-component'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('emails-component')).toBeInTheDocument();
  });
});
