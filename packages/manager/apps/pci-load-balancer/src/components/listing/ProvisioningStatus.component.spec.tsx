import { render } from '@testing-library/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { describe, expect, it } from 'vitest';
import ProvisioningStatusComponent from './ProvisioningStatus.component';
import { wrapper } from '@/wrapperRenders';

describe('ProvisioningStatusComponent', () => {
  it('renders with success color for default status', () => {
    const { getByTestId } = render(
      <ProvisioningStatusComponent provisioningStatus="active" />,
      {
        wrapper,
      },
    );
    const chip = getByTestId('ProvisioningStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.success);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_provisioning_status_active',
    );
  });

  it('renders with warning color for creating status', () => {
    const { getByTestId } = render(
      <ProvisioningStatusComponent provisioningStatus="creating" />,
      {
        wrapper,
      },
    );
    const chip = getByTestId('ProvisioningStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_provisioning_status_creating',
    );
  });

  it('renders with warning color for deleting status', () => {
    const { getByTestId } = render(
      <ProvisioningStatusComponent provisioningStatus="deleting" />,
    );
    const chip = getByTestId('ProvisioningStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_provisioning_status_deleting',
    );
  });

  it('renders with warning color for updating status', () => {
    const { getByTestId } = render(
      <ProvisioningStatusComponent provisioningStatus="updating" />,
    );
    const chip = getByTestId('ProvisioningStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_provisioning_status_updating',
    );
  });

  it('renders with error color for error status', () => {
    const { getByTestId } = render(
      <ProvisioningStatusComponent provisioningStatus="error" />,
    );
    const chip = getByTestId('ProvisioningStatus_chip');
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.error);
    expect(chip).toHaveTextContent(
      'octavia_load_balancer_provisioning_status_error',
    );
  });
});
