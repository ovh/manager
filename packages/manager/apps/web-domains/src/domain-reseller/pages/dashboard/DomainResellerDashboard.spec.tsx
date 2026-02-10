import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DomainResellerDashboard from './DomainResellerDashboard';
import * as utils from '@/common/utils/utils';

vi.mock('@/common/utils/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/utils/utils')>();
  return {
    ...actual,
    getDataFromEnvironment: vi.fn(() => ({
      region: 'EU',
      ovhSubsidiary: 'FR',
    })),
    handleOrderClick: vi.fn(),
  };
});

describe('DomainResellerDashboard', () => {
  it('should render without crashing', () => {
    const { container } = render(<DomainResellerDashboard />);
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    render(<DomainResellerDashboard />);
    expect(screen.getByText('domain_reseller_title')).toBeInTheDocument();
  });

  it('should display information message', () => {
    render(<DomainResellerDashboard />);
    expect(
      screen.getByText('domain_reseller_message_title'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_message_text'),
    ).toBeInTheDocument();
  });

  it('should display action buttons', () => {
    render(<DomainResellerDashboard />);
    expect(
      screen.getByText('domain_reseller_button_add_domain'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('domain_reseller_button_download_catalog'),
    ).toBeInTheDocument();
  });

  it('should call handleOrderClick when add domain button is clicked', async () => {
    const handleOrderClickSpy = vi.spyOn(utils, 'handleOrderClick');
    render(<DomainResellerDashboard />);

    const addButton = screen.getByText('domain_reseller_button_add_domain');
    addButton.click();

    expect(handleOrderClickSpy).toHaveBeenCalledWith(
      'https://order.eu.ovhcloud.com/fr',
    );
  });
});
