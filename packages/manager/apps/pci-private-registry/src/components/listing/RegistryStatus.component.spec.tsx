import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PRIVATE_REGISTRY_STATUS } from '@/constants';
import RegistryStatus from './RegistryStatus.component';

describe('RegistryStatus component', () => {
  const renderComponent = (status: string) =>
    render(<RegistryStatus status={status} />);

  it('should render the component with success color when status is READY', () => {
    renderComponent(PRIVATE_REGISTRY_STATUS.READY);
    const chip = screen.getByTestId('registryStatus_chip');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.success);
  });

  it('should render the component with warning color when status is UPDATING', () => {
    renderComponent(PRIVATE_REGISTRY_STATUS.UPDATING);
    const chip = screen.getByTestId('registryStatus_chip');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
  });

  it('should render the component with warning color when status is RESTORING', () => {
    renderComponent(PRIVATE_REGISTRY_STATUS.RESTORING);
    const chip = screen.getByTestId('registryStatus_chip');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.warning);
  });

  it('should render the component with error color when status is ERROR', () => {
    renderComponent(PRIVATE_REGISTRY_STATUS.ERROR);
    const chip = screen.getByTestId('registryStatus_chip');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.error);
  });

  it('should render the component with info color for an unknown status', () => {
    renderComponent('UNKNOWN_STATUS');
    const chip = screen.getByTestId('registryStatus_chip');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveAttribute('color', ODS_THEME_COLOR_INTENT.info);
  });
});
