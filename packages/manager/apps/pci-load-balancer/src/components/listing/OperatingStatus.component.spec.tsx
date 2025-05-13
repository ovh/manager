import { render } from '@testing-library/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { describe, expect, it } from 'vitest';
import OperatingStatusComponent from './OperatingStatus.component';
import { wrapper } from '@/wrapperRenders';
import { LoadBalancerOperatingStatusEnum } from '@/api/data/load-balancer';

describe('OperatingStatusComponent', () => {
  it('renders with success color for online status', () => {
    const { getByTestId } = render(
      <OperatingStatusComponent
        status={LoadBalancerOperatingStatusEnum.ONLINE}
      />,
      {
        wrapper,
      },
    );
    const chip = getByTestId('OperatingStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.success);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_operating_status_online',
    );
  });

  it('renders with warning color for offline status', () => {
    const { getByTestId } = render(
      <OperatingStatusComponent
        status={LoadBalancerOperatingStatusEnum.OFFLINE}
      />,
      {
        wrapper,
      },
    );
    const chip = getByTestId('OperatingStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_operating_status_offline',
    );
  });

  it('renders with warning color for degraded status', () => {
    const { getByTestId } = render(
      <OperatingStatusComponent
        status={LoadBalancerOperatingStatusEnum.DEGRADED}
      />,
      {
        wrapper,
      },
    );
    const chip = getByTestId('OperatingStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_operating_status_degraded',
    );
  });

  it('renders with warning color for draining status', () => {
    const { getByTestId } = render(
      <OperatingStatusComponent
        status={LoadBalancerOperatingStatusEnum.DRAINING}
      />,
      {
        wrapper,
      },
    );
    const chip = getByTestId('OperatingStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_operating_status_draining',
    );
  });

  it('renders with warning color for noMonitor status', () => {
    const { getByTestId } = render(
      <OperatingStatusComponent
        status={LoadBalancerOperatingStatusEnum.NO_MONITOR}
      />,
      {
        wrapper,
      },
    );
    const chip = getByTestId('OperatingStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_operating_status_noMonitor',
    );
  });

  it('renders with error color for error status', () => {
    const { getByTestId } = render(
      <OperatingStatusComponent
        status={LoadBalancerOperatingStatusEnum.ERROR}
      />,
      {
        wrapper,
      },
    );
    const chip = getByTestId('OperatingStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.error);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_operating_status_error',
    );
  });
});
