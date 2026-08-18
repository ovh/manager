import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  MOCK_CART_ID,
  MOCK_CART_ITEM_ID,
  PAYGO_VAULT_PLAN_CODE,
  mockCart,
  mockCartCheckout,
  mockCartItem,
  mockCartServiceOffers,
  mockCartServiceOffersWithoutVault,
  mockVaultOfferInstallationPricing,
  mockVaultServiceOffer,
} from '@/mocks/order/order.mock';

import {
  addBackupServicesOption,
  assignOrderCart,
  configureCartItemFromRequirements,
  createOrderCart,
  executeOrderCartCheckout,
  getBackupServicesOffers,
  getOrderCartCheckout,
} from './order.requests';
import {
  VAULT_ORDER_OFFER_UNAVAILABLE,
  buildVaultOrderConfigurationValues,
  placeVaultOrder,
} from './vaultOrder';

vi.mock('./order.requests');

const SERVICE_NAME = 'backuplicenses-service';

const context = { ovhSubsidiary: 'FR', serviceName: SERVICE_NAME };

const order = { name: 'vault-paygo-01', region: 'eu-west-par' };

describe('placeVaultOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBackupServicesOffers).mockResolvedValue(mockCartServiceOffers);
    vi.mocked(createOrderCart).mockResolvedValue(mockCart);
    vi.mocked(addBackupServicesOption).mockResolvedValue(mockCartItem);
    vi.mocked(configureCartItemFromRequirements).mockResolvedValue(undefined);
    vi.mocked(assignOrderCart).mockResolvedValue(undefined);
    vi.mocked(getOrderCartCheckout).mockResolvedValue(mockCartCheckout);
    vi.mocked(executeOrderCartCheckout).mockResolvedValue(mockCartCheckout);
  });

  it('buys the vault as an option on the existing service, not as a fresh cart item', async () => {
    await placeVaultOrder(order, context);

    expect(createOrderCart).toHaveBeenCalledWith('FR');
    expect(addBackupServicesOption).toHaveBeenCalledWith(SERVICE_NAME, {
      cartId: MOCK_CART_ID,
      planCode: PAYGO_VAULT_PLAN_CODE,
      duration: mockVaultOfferInstallationPricing.duration,
      pricingMode: mockVaultOfferInstallationPricing.pricingMode,
      quantity: 1,
    });
  });

  it('reads the pricing mode and the duration off the offer instead of assuming them', async () => {
    vi.mocked(getBackupServicesOffers).mockResolvedValue([
      {
        ...mockVaultServiceOffer,
        prices: [
          {
            ...mockVaultOfferInstallationPricing,
            duration: 'P1Y',
            pricingMode: 'consumption-hourly',
          },
        ],
      },
    ]);

    await placeVaultOrder(order, context);

    expect(addBackupServicesOption).toHaveBeenCalledWith(
      SERVICE_NAME,
      expect.objectContaining({ duration: 'P1Y', pricingMode: 'consumption-hourly' }),
    );
  });

  it('offers the item every spelling of the name and the region it might claim', async () => {
    await placeVaultOrder(order, context);

    expect(configureCartItemFromRequirements).toHaveBeenCalledWith(
      MOCK_CART_ID,
      MOCK_CART_ITEM_ID,
      buildVaultOrderConfigurationValues(order),
    );
    expect(Object.values(buildVaultOrderConfigurationValues(order))).toEqual(
      expect.arrayContaining([order.name, order.region]),
    );
  });

  it('never engages the checkout on a half-configured order', async () => {
    vi.mocked(configureCartItemFromRequirements).mockRejectedValue(
      new Error('unknown required cart configuration: unheard_of_label'),
    );

    await expect(placeVaultOrder(order, context)).rejects.toThrow('unheard_of_label');
    expect(getOrderCartCheckout).not.toHaveBeenCalled();
    expect(executeOrderCartCheckout).not.toHaveBeenCalled();
  });

  it('assigns the cart to the account before buying the option on it, since the API refuses an unassigned cart', async () => {
    const calls: string[] = [];
    vi.mocked(assignOrderCart).mockImplementation(async () => {
      calls.push('assigned');
    });
    vi.mocked(addBackupServicesOption).mockImplementation(async () => {
      calls.push('option-added');
      return mockCartItem;
    });

    await placeVaultOrder(order, context);

    expect(calls).toEqual(['assigned', 'option-added']);
  });

  it('simulates the checkout before engaging it, and engages it exactly once', async () => {
    await placeVaultOrder(order, context);

    expect(assignOrderCart).toHaveBeenCalledWith(MOCK_CART_ID);
    expect(getOrderCartCheckout).toHaveBeenCalledWith(MOCK_CART_ID);
    expect(executeOrderCartCheckout).toHaveBeenCalledTimes(1);
    expect(executeOrderCartCheckout).toHaveBeenCalledWith(MOCK_CART_ID);
  });

  it('opens no cart when the service carries no orderable pay-as-you-go vault offer', async () => {
    vi.mocked(getBackupServicesOffers).mockResolvedValue(mockCartServiceOffersWithoutVault);

    await expect(placeVaultOrder(order, context)).rejects.toThrow(VAULT_ORDER_OFFER_UNAVAILABLE);
    expect(createOrderCart).not.toHaveBeenCalled();
  });

  it('opens no cart when the offer exists but nothing about it can be installed', async () => {
    vi.mocked(getBackupServicesOffers).mockResolvedValue([
      { ...mockVaultServiceOffer, prices: [] },
    ]);

    await expect(placeVaultOrder(order, context)).rejects.toThrow(VAULT_ORDER_OFFER_UNAVAILABLE);
    expect(createOrderCart).not.toHaveBeenCalled();
  });
});
