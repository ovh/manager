import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { ServiceInfoRenewModeEnum, Universe } from '@/common/enum/common.enum';
import RenewFrequencyTileItem from './RenewFrequencyTileItem';

describe('Renew Frequency component', () => {
  it('renders populated state with renew frequency information', () => {
    const { container } = render(
      <RenewFrequencyTileItem
        mode={ServiceInfoRenewModeEnum.Automatic}
        period="P1Y"
        serviceName="example.com"
        isDomainPage={false}
        universe={Universe.DOMAIN}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(
        'domain_tab_general_information_subscription_renew_frequency',
      ),
    ).toBeInTheDocument();

    const actionMenu = container.querySelector('#renew-frequency');
    expect(actionMenu).toBeInTheDocument();
  });
});
