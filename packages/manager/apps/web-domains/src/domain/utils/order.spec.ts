import { describe, it, expect, vi } from 'vitest';
import { formatOrderProduct, generateOrderUrl } from './order';

vi.mock('jsurl', () => ({
  default: {
    stringify: (obj: any) => JSON.stringify(obj),
  },
}));

vi.mock('@/domain/constants/order', () => ({
  ANYCAST_ORDER_CONSTANT: {
    DURATION: 'P1Y',
    PRODUCT_ID: 'anycast',
    QUANTITY: 1,
    PRICING_MODE: 'default',
    ANYCAST_PLAN_CODE: 'anycast',
    DNSSEC_CONFIGURATION: { label: 'dnssec', value: true },
  },
  DEFAULT_DNS_CONFIGURATION: (zoneName: string) => [
    { label: 'zone', value: zoneName },
  ],
}));

describe('formatOrderProduct', () => {
  const base = {
    planCode: 'zone',
    zoneName: 'example.com',
    dnssec: false,
    activateZone: false,
  };

  it('returns the minimum config without activateZone or dnssec', () => {
    const result = formatOrderProduct({ ...base });
    expect(result).toMatchObject({
      planCode: base.planCode,
      duration: 'P1Y',
      productId: 'anycast',
      quantity: 1,
      pricingMode: 'default',
      configuration: [],
      serviceName: base.zoneName,
    });
    expect(result).not.toHaveProperty('option');
  });

  it('adds configuration with activateZone', () => {
    const result = formatOrderProduct({ ...base, activateZone: true });
    expect(result).toMatchObject({
      planCode: base.planCode,
      configuration: [{ label: 'zone', value: base.zoneName }],
      option: [
        {
          duration: 'P1Y',
          planCode: 'anycast',
          quantity: 1,
          pricingMode: 'default',
        },
      ],
    });
    expect(result).not.toHaveProperty('serviceName');
  });

  it('adds configuration without activateZone', () => {
    const result = formatOrderProduct({ ...base, dnssec: true });
    expect(result).toMatchObject({
      configuration: [{ label: 'dnssec', value: true }],
      serviceName: base.zoneName,
    });
    expect(result).not.toHaveProperty('option');
  });

  it('activateZone and dnssec combined', () => {
    const result = formatOrderProduct({
      ...base,
      activateZone: true,
      dnssec: true,
    });
    expect(result).toMatchObject({
      configuration: [
        { label: 'zone', value: base.zoneName },
        { label: 'dnssec', value: true },
      ],
      option: [
        {
          duration: 'P1Y',
          planCode: 'anycast',
          quantity: 1,
          pricingMode: 'default',
        },
      ],
    });
    expect(result).not.toHaveProperty('serviceName');
  });

  it('support another planCode and zoneName', () => {
    const result = formatOrderProduct({
      planCode: 'zone',
      zoneName: 'example.fr',
      dnssec: false,
      activateZone: true,
    });
    expect(result).toMatchObject({
      planCode: 'zone',
      configuration: [{ label: 'zone', value: 'example.fr' }],
    });
  });
});

describe('generateOrderUrl', () => {
  it('encodes the list of products formatted in the URL', () => {
    const products = [
      {
        planCode: 'zone',
        zoneName: 'example.com',
        dnssec: false,
        activateZone: false,
      },
      {
        planCode: 'zone',
        zoneName: 'example.fr',
        dnssec: true,
        activateZone: true,
      },
    ];
    const formatted = products.map(formatOrderProduct);
    const url = generateOrderUrl({
      baseUrl: 'https://order.ovh.com',
      products,
    });
    expect(url).toBe(
      `https://order.ovh.com?products=${JSON.stringify(formatted)}`,
    );
  });

  it('manages the case with a single product', () => {
    const products = [
      {
        planCode: 'zone-basic',
        zoneName: 'example.com',
        dnssec: false,
        activateZone: false,
      },
    ];
    const formatted = products.map(formatOrderProduct);
    const url = generateOrderUrl({ baseUrl: '/order', products });
    expect(url).toBe(`/order?products=${JSON.stringify(formatted)}`);
  });

  it('returns a URL even for an empty list', () => {
    const url = generateOrderUrl({ baseUrl: '/order', products: [] });
    expect(url).toBe(`/order?products=${JSON.stringify([])}`);
  });
});
