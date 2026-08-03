import { describe, expect, it } from 'vitest';

import { ServiceConsumption } from '@/types/Consumption.type';

import { selectVaultConsumptionElement } from './vaultConsumption.selectors';

const buildConsumption = (planCode: string): ServiceConsumption => ({
  beginDate: null,
  endDate: null,
  pricingMode: 'consumption',
  quantity: 10,
  planCode,
  planFamily: 'backup',
  price: { currencyCode: 'EUR', text: '1,00 €', value: 100000000 },
  uniqueId: null,
});

describe('selectVaultConsumptionElement', () => {
  it('selects the element whose planCode is the bundle plan code', () => {
    const bundle = buildConsumption('backup-vault-backuplicenses-500g-consumption');
    expect(selectVaultConsumptionElement([bundle])).toBe(bundle);
  });

  it('selects the element whose planCode is the paygo plan code', () => {
    const paygo = buildConsumption('backup-vault-backuplicenses-paygo-consumption');
    expect(selectVaultConsumptionElement([paygo])).toBe(paygo);
  });

  it('returns undefined when no element matches a known plan code', () => {
    expect(selectVaultConsumptionElement([buildConsumption('other-plan-code')])).toBeUndefined();
  });
});
