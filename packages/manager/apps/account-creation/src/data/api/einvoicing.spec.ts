import { describe, expect, it, beforeEach, vi } from 'vitest';
import { LegalForm } from '@ovh-ux/manager-config';

const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock('@ovh-ux/manager-core-api', () => ({ v6: { post } }));

// eslint-disable-next-line import/first
import { getEinvoicingRules } from './einvoicing';

const params = {
  siret: '98471504500012',
  legalForm: 'corporation' as LegalForm,
};

describe('getEinvoicingRules', () => {
  beforeEach(() => post.mockReset());

  it('normalizes the real /newAccount/rules entry (camelCase, no `visible` field)', async () => {
    post.mockResolvedValue({
      data: [
        { fieldName: 'displayName', mandatory: false, in: null },
        {
          fieldName: 'einvoicingBillingAddress',
          mandatory: true,
          in: ['984715045'],
          defaultValue: '984715045',
        },
      ],
    });
    await expect(getEinvoicingRules(params)).resolves.toEqual({
      visible: true, // derived from the entry's presence
      mandatory: true,
      in: ['984715045'],
      defaultValue: '984715045',
    });
  });

  it('is not visible when the entry is absent from the rules array', async () => {
    post.mockResolvedValue({ data: [{ fieldName: 'displayName' }] });
    const rule = await getEinvoicingRules(params);
    expect(rule.visible).toBe(false);
    expect(rule.in).toBe(null);
  });

  it('honors an explicit visible:false when present', async () => {
    post.mockResolvedValue({
      data: [{ fieldName: 'einvoicingBillingAddress', visible: false, in: [] }],
    });
    const rule = await getEinvoicingRules(params);
    expect(rule.visible).toBe(false);
  });

  it('also parses the contract snake_case shape (field_name / value.in / default_value)', async () => {
    post.mockResolvedValue({
      data: [
        {
          field_name: 'einvoicing_billing_address',
          mandatory: true,
          value: { in: ['a', 'b'] },
          default_value: null,
        },
      ],
    });
    await expect(getEinvoicingRules(params)).resolves.toEqual({
      visible: true,
      mandatory: true,
      in: ['a', 'b'],
      defaultValue: null,
    });
  });
});
