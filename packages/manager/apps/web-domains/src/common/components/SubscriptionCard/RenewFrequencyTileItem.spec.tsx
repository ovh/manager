import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { describe, it, expect } from 'vitest';
import { ServiceInfoRenewModeEnum, Universe } from '@/common/enum/common.enum';
import RenewFrequencyTileItem from './RenewFrequencyTileItem';

describe('RenewFrequencyTileItem', () => {
  const defaultProps = {
    mode: ServiceInfoRenewModeEnum.Automatic,
    period: 'P1Y',
    serviceName: 'example.com',
    isDomainPage: false,
    universe: Universe.DOMAIN,
  };

  it('should render renew frequency label', () => {
    render(<RenewFrequencyTileItem {...defaultProps} />, { wrapper });

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_renew_frequency',
      ),
    ).toBeInTheDocument();
  });

  it('should render action menu', () => {
    const { container } = render(<RenewFrequencyTileItem {...defaultProps} />, {
      wrapper,
    });

    const actionMenu = container.querySelector('#renew-frequency');
    expect(actionMenu).toBeInTheDocument();
  });

  it('should render with manual mode', () => {
    render(
      <RenewFrequencyTileItem
        {...defaultProps}
        mode={ServiceInfoRenewModeEnum.Manual}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_renew_frequency',
      ),
    ).toBeInTheDocument();
  });

  it('should render with isDomainPage true and manual mode', () => {
    render(
      <RenewFrequencyTileItem
        {...defaultProps}
        mode={ServiceInfoRenewModeEnum.Manual}
        isDomainPage
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_renew_frequency',
      ),
    ).toBeInTheDocument();
  });
});
