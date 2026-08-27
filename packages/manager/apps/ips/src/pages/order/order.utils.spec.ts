import { Pricing } from '@/data/hooks/catalog';
import { ServiceType } from '@/types';

import { filterIpBlockPricingListByServiceType } from './order.utils';

const buildPricing = (planCode: string): Pricing => ({
  label: `label-${planCode}`,
  value: planCode,
  pricingMode: 'default',
});

const IP_BLOCK_PRICING_LIST: Pricing[] = [
  buildPricing('ip-v4-s20-arin'),
  buildPricing('ip-v4-s24-arin'),
  buildPricing('ip-v4-s25-ripe'),
  buildPricing('ip-v4-s26-ripe'),
  buildPricing('ip-v4-s27-arin'),
  buildPricing('ip-v4-s28-arin'),
  buildPricing('ip-v4-s29-ripe'),
];

describe('filterIpBlockPricingListByServiceType', () => {
  it('keeps only IP blocks between /24 and /28 when service type is VCFAAS', () => {
    const result = filterIpBlockPricingListByServiceType(
      IP_BLOCK_PRICING_LIST,
      ServiceType.vcfaas,
    );

    expect(result.map(({ value }) => value)).toEqual([
      'ip-v4-s24-arin',
      'ip-v4-s25-ripe',
      'ip-v4-s26-ripe',
      'ip-v4-s27-arin',
      'ip-v4-s28-arin',
    ]);
  });

  it.each([
    ServiceType.dedicatedCloud,
    ServiceType.vrack,
    ServiceType.ipParking,
    ServiceType.server,
    ServiceType.vps,
    ServiceType.unknown,
  ])('returns the list untouched when service type is %s', (serviceType) => {
    const result = filterIpBlockPricingListByServiceType(
      IP_BLOCK_PRICING_LIST,
      serviceType,
    );

    expect(result).toEqual(IP_BLOCK_PRICING_LIST);
  });

  it('returns an empty list when no plan code matches the VCFAAS mask range', () => {
    const result = filterIpBlockPricingListByServiceType(
      [buildPricing('ip-v4-s20-arin'), buildPricing('ip-v4-s29-ripe')],
      ServiceType.vcfaas,
    );

    expect(result).toEqual([]);
  });

  it('ignores plan codes without a parsable block mask when service type is VCFAAS', () => {
    const unparsablePricing = buildPricing('ip-v4-block-arin');

    const result = filterIpBlockPricingListByServiceType(
      [...IP_BLOCK_PRICING_LIST, unparsablePricing],
      ServiceType.vcfaas,
    );

    expect(result.map(({ value }) => value)).not.toContain(
      unparsablePricing.value,
    );
  });

  it('returns an empty array when given an empty list', () => {
    expect(
      filterIpBlockPricingListByServiceType([], ServiceType.vcfaas),
    ).toEqual([]);
  });
});
