import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createWrapper } from '@/wrapperRenders';
import StartupProgram from './StartupProgram';

describe('StartupProgram', () => {
  const defaultProps = {
    value: '100.00 €',
  };

  const renderComponent = (props = defaultProps) =>
    render(<StartupProgram {...props} />, { wrapper: createWrapper() });

  it('should render the startup program title', () => {
    renderComponent();

    expect(
      screen.getByText('pci_project_new_payment_startup_program_title'),
    ).toBeVisible();
  });

  it('should render the startup program info text', () => {
    renderComponent();

    expect(
      screen.getByText('pci_project_new_payment_startup_program_info'),
    ).toBeVisible();
  });

  it('should display the amount available text', () => {
    renderComponent();

    expect(
      screen.getByText(
        'pci_project_new_payment_startup_program_amount_available',
      ),
    ).toBeVisible();
  });
});
