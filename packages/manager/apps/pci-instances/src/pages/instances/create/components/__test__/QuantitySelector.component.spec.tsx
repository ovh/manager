import { describe, expect, test } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuantitySelector } from '../QuantitySelector.component';
import { renderWithMockedWrappers } from '@/__tests__/wrapperRenders';
import { TestCreateInstanceFormWrapper } from '@/__tests__/CreateInstanceFormWrapper';

type TRenderQuantitySelectorProps = {
  quota?: number;
  type?: string;
  region?: string;
  defaultQuantity?: number;
};

const renderQuantitySelector = ({
  quota = 10,
  type = 'baremetal',
  region = 'GRA',
  defaultQuantity = 1,
}: TRenderQuantitySelectorProps = {}) =>
  renderWithMockedWrappers(
    <TestCreateInstanceFormWrapper
      defaultValues={{ quantity: defaultQuantity }}
    >
      <QuantitySelector quota={quota} type={type} region={region} />
    </TestCreateInstanceFormWrapper>,
  );

describe('Considering QuantitySelector component', () => {
  test('displays quantity label and input', () => {
    renderQuantitySelector();

    expect(
      screen.getByLabelText(/pci_instances_creation_quantity_label/i),
    ).toBeInTheDocument();

    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
  });

  test('shows initial quantity from form', () => {
    renderQuantitySelector({ defaultQuantity: 1 });

    const input = screen.getByRole('spinbutton', { hidden: true });
    expect(input).toHaveAttribute('aria-valuenow', '1');
  });

  test('disables input when quota is zero', () => {
    renderQuantitySelector({ quota: 0 });

    const input = screen.getByRole('spinbutton', { hidden: true });
    expect(input).toBeDisabled();
  });

  test('updates displayed quantity when user changes value', async () => {
    const user = userEvent.setup();
    renderQuantitySelector({ quota: 10, defaultQuantity: 1 });

    const input = screen.getByRole('spinbutton', { hidden: true });
    await user.clear(input);
    await user.type(input, '5');

    expect(input).toHaveAttribute('aria-valuenow', '5');
  });

  test('rule text shows quota link', () => {
    renderQuantitySelector({
      quota: 10,
      type: 'baremetal',
      region: 'GRA',
    });

    expect(
      screen.getByText(/pci_instance_creation_quantity_rule/i),
    ).toBeInTheDocument();
    const quotaLink = screen.getByRole('link');
    expect(quotaLink).toHaveAttribute('href', expect.stringContaining('quota'));
  });
});
