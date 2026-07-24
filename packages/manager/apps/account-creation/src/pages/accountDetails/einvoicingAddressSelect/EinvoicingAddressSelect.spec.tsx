import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { EinvoicingRule } from '@/types/einvoicing';
import EinvoicingAddressSelect from './EinvoicingAddressSelect.component';

const renderComponent = (
  rule: EinvoicingRule | undefined,
  value?: string,
  onValueChange = vi.fn(),
) =>
  render(
    <EinvoicingAddressSelect
      rule={rule}
      value={value}
      onValueChange={onValueChange}
    />,
  );

describe('EinvoicingAddressSelect', () => {
  it('RG1: renders nothing when the rule is missing', () => {
    const { container } = renderComponent(undefined);
    expect(container).toBeEmptyDOMElement();
  });

  it('RG1: renders nothing when the rule is not visible', () => {
    const { container } = renderComponent({
      visible: false,
      mandatory: false,
      in: null,
      defaultValue: null,
    });
    expect(container).toBeEmptyDOMElement();
  });

  it('RG2: renders one option per active address', () => {
    renderComponent({
      visible: true,
      mandatory: true,
      in: ['1 rue A, 59100 Roubaix', '2 rue B, 59100 Roubaix'],
      defaultValue: null,
    });
    expect(screen.getByText('1 rue A, 59100 Roubaix')).toBeInTheDocument();
    expect(screen.getByText('2 rue B, 59100 Roubaix')).toBeInTheDocument();
  });

  it('RG3: pre-selects the address when there is a single entry / defaultValue', async () => {
    const onValueChange = vi.fn();
    renderComponent(
      {
        visible: true,
        mandatory: true,
        in: ['1 rue A, 59100 Roubaix'],
        defaultValue: '1 rue A, 59100 Roubaix',
      },
      undefined,
      onValueChange,
    );
    await waitFor(() =>
      expect(onValueChange).toHaveBeenCalledWith('1 rue A, 59100 Roubaix'),
    );
  });

  it('RG3: does not override an existing selection', () => {
    const onValueChange = vi.fn();
    renderComponent(
      {
        visible: true,
        mandatory: true,
        in: ['1 rue A, 59100 Roubaix'],
        defaultValue: '1 rue A, 59100 Roubaix',
      },
      '1 rue A, 59100 Roubaix',
      onValueChange,
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('RG4: shows the informational message when no active address', () => {
    renderComponent({
      visible: true,
      mandatory: false,
      in: [],
      defaultValue: null,
    });
    expect(
      screen.getByText('account_details_einvoicing_no_active_address'),
    ).toBeInTheDocument();
  });
});
