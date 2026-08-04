import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LegalForm } from '@ovh-ux/manager-config';
import { Rule } from '@/types/rule';
import EinvoicingAddressSelect from './EinvoicingAddressSelect.component';

type SelectRule = Pick<Rule, 'in' | 'defaultValue' | 'mandatory'>;

const rule = (over: Partial<SelectRule> = {}): SelectRule => ({
  mandatory: true,
  in: null,
  defaultValue: null,
  ...over,
});

const renderComponent = ({
  rule: ruleProp,
  legalForm = 'corporation' as LegalForm,
  value,
  onValueChange = vi.fn(),
}: {
  rule?: SelectRule;
  legalForm?: LegalForm;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
}) =>
  render(
    <EinvoicingAddressSelect
      rule={ruleProp}
      legalForm={legalForm}
      value={value}
      onValueChange={onValueChange}
    />,
  );

describe('EinvoicingAddressSelect', () => {
  it('renders nothing when the rule is missing (SIRET unknown to the directory)', () => {
    const { container } = renderComponent({ rule: undefined });
    expect(container).toBeEmptyDOMElement();
  });

  it('empty addresses, B2B → informational banner (no picker)', () => {
    renderComponent({
      rule: rule({ mandatory: false, in: [] }),
      legalForm: 'corporation' as LegalForm,
    });
    expect(
      screen.getByText('account_details_einvoicing_empty_b2b'),
    ).toBeInTheDocument();
  });

  it('empty addresses, B2G → dedicated informational banner', () => {
    renderComponent({
      rule: rule({ mandatory: false, in: [] }),
      legalForm: 'administration' as LegalForm,
    });
    expect(
      screen.getByText('account_details_einvoicing_empty_b2g'),
    ).toBeInTheDocument();
  });

  it('single address → banner and the address is auto-selected', async () => {
    const onValueChange = vi.fn();
    renderComponent({
      rule: rule({
        in: ['1 rue A, 59100 Roubaix'],
        defaultValue: '1 rue A, 59100 Roubaix',
      }),
      legalForm: 'corporation' as LegalForm,
      onValueChange,
    });
    expect(
      screen.getByText('account_details_einvoicing_single_b2b'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(onValueChange).toHaveBeenCalledWith('1 rue A, 59100 Roubaix'),
    );
  });

  it('several addresses → renders a select with one option per address', () => {
    renderComponent({
      rule: rule({ in: ['1 rue A, 59100 Roubaix', '2 rue B, 59100 Roubaix'] }),
      legalForm: 'corporation' as LegalForm,
    });
    expect(screen.getByText('1 rue A, 59100 Roubaix')).toBeInTheDocument();
    expect(screen.getByText('2 rue B, 59100 Roubaix')).toBeInTheDocument();
    // B2B shows the base "please select" message, not the B2G variant.
    expect(
      screen.getByText('account_details_einvoicing_multi_b2b'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('account_details_einvoicing_multi_b2g'),
    ).not.toBeInTheDocument();
  });

  it('several addresses, B2G → shows the B2G "please select" message', () => {
    renderComponent({
      rule: rule({ in: ['1 rue A, 59100 Roubaix', '2 rue B, 59100 Roubaix'] }),
      legalForm: 'administration' as LegalForm,
    });
    expect(
      screen.getByText('account_details_einvoicing_multi_b2g'),
    ).toBeInTheDocument();
  });

  it('single address, B2G → dedicated banner and auto-selected', async () => {
    const onValueChange = vi.fn();
    renderComponent({
      rule: rule({
        in: ['1 rue A, 59100 Roubaix'],
        defaultValue: '1 rue A, 59100 Roubaix',
      }),
      legalForm: 'administration' as LegalForm,
      onValueChange,
    });
    expect(
      screen.getByText('account_details_einvoicing_single_b2g'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(onValueChange).toHaveBeenCalledWith('1 rue A, 59100 Roubaix'),
    );
  });

  it('empty addresses with a lingering value → clears it', async () => {
    const onValueChange = vi.fn();
    renderComponent({
      rule: rule({ mandatory: false, in: [] }),
      legalForm: 'corporation' as LegalForm,
      value: 'stale-value',
      onValueChange,
    });
    await waitFor(() => expect(onValueChange).toHaveBeenCalledWith(undefined));
  });

  it('several addresses → does not auto-select (customer must pick)', () => {
    const onValueChange = vi.fn();
    renderComponent({
      rule: rule({ in: ['1 rue A, 59100 Roubaix', '2 rue B, 59100 Roubaix'] }),
      legalForm: 'corporation' as LegalForm,
      value: '2 rue B, 59100 Roubaix',
      onValueChange,
    });
    // The pre-selected value is kept as-is and no automatic change is emitted.
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
