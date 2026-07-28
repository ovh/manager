import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LegalForm } from '@ovh-ux/manager-config';
import { EinvoicingRule } from '@/types/einvoicing';
import EinvoicingAddressSelect from './EinvoicingAddressSelect.component';

const renderComponent = ({
  rule,
  legalForm = 'corporation' as LegalForm,
  siren,
  value,
  onValueChange = vi.fn(),
}: {
  rule?: EinvoicingRule;
  legalForm?: LegalForm;
  siren?: string;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
}) =>
  render(
    <EinvoicingAddressSelect
      rule={rule}
      legalForm={legalForm}
      siren={siren}
      value={value}
      onValueChange={onValueChange}
    />,
  );

describe('EinvoicingAddressSelect', () => {
  it('renders nothing when the rule is missing or not visible', () => {
    const { container: c1 } = renderComponent({ rule: undefined });
    expect(c1).toBeEmptyDOMElement();
    const { container: c2 } = renderComponent({
      rule: { visible: false, mandatory: false, in: null, defaultValue: null },
    });
    expect(c2).toBeEmptyDOMElement();
  });

  it('empty addresses, B2B → informational banner (no picker)', () => {
    renderComponent({
      rule: { visible: true, mandatory: false, in: [], defaultValue: null },
      legalForm: 'corporation' as LegalForm,
      siren: '424761419',
    });
    expect(
      screen.getByText('account_details_einvoicing_empty_b2b'),
    ).toBeInTheDocument();
  });

  it('empty addresses, B2G → dedicated informational banner', () => {
    renderComponent({
      rule: { visible: true, mandatory: false, in: [], defaultValue: null },
      legalForm: 'administration' as LegalForm,
    });
    expect(
      screen.getByText('account_details_einvoicing_empty_b2g'),
    ).toBeInTheDocument();
  });

  it('single address → banner and the address is auto-selected', async () => {
    const onValueChange = vi.fn();
    renderComponent({
      rule: {
        visible: true,
        mandatory: true,
        in: ['1 rue A, 59100 Roubaix'],
        defaultValue: '1 rue A, 59100 Roubaix',
      },
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
      rule: {
        visible: true,
        mandatory: true,
        in: ['1 rue A, 59100 Roubaix', '2 rue B, 59100 Roubaix'],
        defaultValue: null,
      },
      legalForm: 'corporation' as LegalForm,
    });
    expect(screen.getByText('1 rue A, 59100 Roubaix')).toBeInTheDocument();
    expect(screen.getByText('2 rue B, 59100 Roubaix')).toBeInTheDocument();
    // B2B has no extra directory note.
    expect(
      screen.queryByText('account_details_einvoicing_multi_b2g_hint'),
    ).not.toBeInTheDocument();
  });

  it('several addresses, B2G → shows the additional directory note', () => {
    renderComponent({
      rule: {
        visible: true,
        mandatory: true,
        in: ['1 rue A, 59100 Roubaix', '2 rue B, 59100 Roubaix'],
        defaultValue: null,
      },
      legalForm: 'administration' as LegalForm,
    });
    expect(
      screen.getByText('account_details_einvoicing_multi_b2g_hint'),
    ).toBeInTheDocument();
  });
});
