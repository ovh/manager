import '@/common/setupTests';
import { render, screen } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import { describe, it, expect } from 'vitest';
import RenewModeTileItem from './RenewModeTileItem';
import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewModeEnum,
  Universe,
} from '@/common/enum/common.enum';

describe('RenewModeTileItem', () => {
  const defaultProps = {
    renewMode: ServiceInfoRenewModeEnum.Automatic,
    pendingActions: [] as LifecycleCapacitiesEnum[],
    serviceName: 'test-domain.com',
    isDomainPage: false,
    universe: Universe.DOMAIN,
  };

  it('should render with automatic renew mode', () => {
    render(<RenewModeTileItem {...defaultProps} />, { wrapper });

    expect(
      screen.getByText('allDom_table_header_renewMode'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(`allDom_status_${ServiceInfoRenewModeEnum.Automatic}`),
    ).toBeInTheDocument();
  });

  it('should render with manual renew mode', () => {
    render(
      <RenewModeTileItem
        {...defaultProps}
        renewMode={ServiceInfoRenewModeEnum.Manual}
      />,
      { wrapper },
    );

    expect(
      screen.getByText(`allDom_status_${ServiceInfoRenewModeEnum.Manual}`),
    ).toBeInTheDocument();
  });

  it('should render with isDomainPage true and manual renew mode', () => {
    render(
      <RenewModeTileItem
        {...defaultProps}
        renewMode={ServiceInfoRenewModeEnum.Manual}
        isDomainPage
      />,
      { wrapper },
    );

    expect(
      screen.getByText(`allDom_status_${ServiceInfoRenewModeEnum.Manual}`),
    ).toBeInTheDocument();
  });

  it('should render terminate status when pending termination', () => {
    render(
      <RenewModeTileItem
        {...defaultProps}
        pendingActions={[LifecycleCapacitiesEnum.TerminateAtExpirationDate]}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('allDom_table_status_terminate'),
    ).toBeInTheDocument();
  });

  it('should render action menu with modify link', () => {
    const { container } = render(<RenewModeTileItem {...defaultProps} />, {
      wrapper,
    });

    const actionMenu = container.querySelector('#renew-mode');
    expect(actionMenu).toBeInTheDocument();
  });
});
