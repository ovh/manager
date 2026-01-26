import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { describe, it, expect } from 'vitest';
import ExpirationDate from './ExpirationDate';

describe('ExpirationDate', () => {
  const defaultProps = {
    date: '2024-12-31T23:59:59Z',
    serviceName: 'example.com',
    isFetchingDomainResources: false,
  };

  it('should render expiration date label', () => {
    render(<ExpirationDate {...defaultProps} />, { wrapper });

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_expiration_date',
      ),
    ).toBeInTheDocument();
  });

  it('should render formatted expiration date', () => {
    render(<ExpirationDate {...defaultProps} />, { wrapper });

    const tileItem = screen.getByText(
      'domain_tab_general_information_subscription_expiration_date',
    );
    expect(tileItem.closest('[class]')?.parentElement).toBeDefined();
  });

  it('should render action menu', () => {
    const { container } = render(<ExpirationDate {...defaultProps} />, {
      wrapper,
    });

    const actionMenu = container.querySelector('#expiration-date');
    expect(actionMenu).toBeInTheDocument();
  });
});
