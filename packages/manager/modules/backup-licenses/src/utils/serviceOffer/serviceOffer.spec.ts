import { describe, expect, it } from 'vitest';

import {
  PAYGO_VAULT_PLAN_CODE,
  TEST_VAULT_OFFER_PRICE_IN_UCENTS,
  buildTestOfferPricing,
  mockCartServiceOffers,
  mockUnorderableServiceOffer,
  mockVaultServiceOffer,
} from '@/mocks/order/order.mock';
import { CartOfferPricing, CartServiceOffer } from '@/types/OrderCart.type';

import {
  findServiceOffer,
  getOfferInstallationPricing,
  getOfferOrderParameters,
} from './serviceOffer';

const withPrices = (prices: CartOfferPricing[]): CartServiceOffer => ({
  ...mockVaultServiceOffer,
  prices,
});

const pricing = (overrides: Partial<CartOfferPricing>): CartOfferPricing =>
  buildTestOfferPricing(TEST_VAULT_OFFER_PRICE_IN_UCENTS, overrides);

describe('findServiceOffer', () => {
  it('finds the offer carrying the plan code', () => {
    expect(findServiceOffer(mockCartServiceOffers, PAYGO_VAULT_PLAN_CODE)).toBe(
      mockVaultServiceOffer,
    );
  });

  it('returns undefined when the plan code is absent from the offers', () => {
    expect(findServiceOffer(mockCartServiceOffers, 'no-such-plan')).toBeUndefined();
  });

  it('returns undefined when the offers are not loaded', () => {
    expect(findServiceOffer(undefined, PAYGO_VAULT_PLAN_CODE)).toBeUndefined();
  });
});

describe('getOfferInstallationPricing', () => {
  it('keeps the pricing that can be installed, not the one that only renews', () => {
    expect(getOfferInstallationPricing(mockVaultServiceOffer)?.capacities).toContain(
      'installation',
    );
  });

  it('returns undefined for an offer with no installable pricing', () => {
    expect(getOfferInstallationPricing(mockUnorderableServiceOffer)).toBeUndefined();
  });

  it('returns undefined when the offer is missing', () => {
    expect(getOfferInstallationPricing(undefined)).toBeUndefined();
  });
});

describe('getOfferOrderParameters', () => {
  it('reads the four POST parameters off the installable pricing', () => {
    expect(getOfferOrderParameters(mockVaultServiceOffer)).toEqual({
      duration: 'P1M',
      planCode: PAYGO_VAULT_PLAN_CODE,
      pricingMode: 'default',
      quantity: 1,
    });
  });

  it('never assumes the monthly default pattern — mode and duration come from the offer', () => {
    const offer = withPrices([
      pricing({ capacities: ['installation'], duration: 'P1Y', pricingMode: 'consumption-hourly' }),
    ]);

    expect(getOfferOrderParameters(offer)).toMatchObject({
      duration: 'P1Y',
      pricingMode: 'consumption-hourly',
    });
  });

  it('orders one unit when the offer announces a minimum quantity of zero', () => {
    const offer = withPrices([pricing({ minimumQuantity: 0 })]);

    expect(getOfferOrderParameters(offer)?.quantity).toBe(1);
  });

  it('honours a minimum quantity above one', () => {
    const offer = withPrices([pricing({ minimumQuantity: 5 })]);

    expect(getOfferOrderParameters(offer)?.quantity).toBe(5);
  });

  it('returns undefined when no pricing is installable', () => {
    expect(getOfferOrderParameters(mockUnorderableServiceOffer)).toBeUndefined();
  });

  it('returns undefined when the offer is missing', () => {
    expect(getOfferOrderParameters(undefined)).toBeUndefined();
  });
});
