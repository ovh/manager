import { Cart, Item, Order } from '@ovh-ux/manager-module-order';

import {
  CartItemRequiredConfiguration,
  CartOfferPricing,
  CartServiceOffer,
} from '@/types/OrderCart.type';

/**
 * Prix ARBITRAIRES DE TEST. Le catalogue `backupServices` n'est pas publié : personne ne connaît
 * les vrais montants, et aucun ne doit exister en dur hors de ces fixtures. 42.42 et 13.37 sont
 * choisis pour être reconnaissables comme faux si jamais ils s'affichaient ailleurs qu'en test.
 */
export const TEST_VAULT_OFFER_PRICE_IN_UCENTS = 4_242_000_000;

export const TEST_TENANT_OFFER_PRICE_IN_UCENTS = 1_337_000_000;

export const buildTestOfferPricing = (
  priceInUcents: number,
  overrides: Partial<CartOfferPricing> = {},
): CartOfferPricing => ({
  capacities: ['installation', 'renew'],
  description: 'test pricing',
  duration: 'P1M',
  interval: 1,
  maximumQuantity: null,
  maximumRepeat: null,
  minimumQuantity: 1,
  minimumRepeat: 1,
  price: {
    currencyCode: 'EUR',
    priceInUcents,
    text: `${priceInUcents / 100_000_000} € (test)`,
    value: priceInUcents / 100_000_000,
  },
  priceInUcents,
  pricingMode: 'default',
  pricingType: 'consumption',
  ...overrides,
});

export const PAYGO_VAULT_PLAN_CODE = 'backup-vault-backuplicenses-paygo';

export const mockVaultServiceOffer: CartServiceOffer = {
  exclusive: false,
  family: 'vault',
  mandatory: false,
  planCode: PAYGO_VAULT_PLAN_CODE,
  prices: [
    buildTestOfferPricing(TEST_VAULT_OFFER_PRICE_IN_UCENTS),
    buildTestOfferPricing(TEST_VAULT_OFFER_PRICE_IN_UCENTS, { capacities: ['upgrade'] }),
  ],
  productName: 'Backup Licenses PAYGO vault',
  productType: 'storage',
};

export const mockUnorderableServiceOffer: CartServiceOffer = {
  exclusive: false,
  family: 'license',
  mandatory: false,
  planCode: 'vspc-tenant-backuplicenses',
  prices: [buildTestOfferPricing(TEST_TENANT_OFFER_PRICE_IN_UCENTS, { capacities: ['renew'] })],
  productName: 'Backup Licenses VSPC tenant',
  productType: 'saas_license',
};

export const mockCartServiceOffers: CartServiceOffer[] = [
  mockVaultServiceOffer,
  mockUnorderableServiceOffer,
];

export const mockCartServiceOffersWithoutVault: CartServiceOffer[] = [mockUnorderableServiceOffer];

export const MOCK_CART_ID = 'test-cart-id';

export const MOCK_CART_ITEM_ID = 1234;

export const mockCart: Cart = {
  cartId: MOCK_CART_ID,
  description: 'test cart',
  items: [],
  readOnly: false,
};

export const mockCartItem: Item = {
  cartId: MOCK_CART_ID,
  configurations: [],
  duration: 'P1M',
  itemId: MOCK_CART_ITEM_ID,
  offerId: 'test-offer-id',
  options: [],
  prices: [],
  productId: 'backupServices',
  settings: {},
};

export const mockCartRequiredConfiguration: CartItemRequiredConfiguration[] = [
  { fields: null, label: 'vault_name', required: true, type: 'string' },
  { fields: null, label: 'vault_region', required: true, type: 'string' },
  { fields: null, label: 'optional_note', required: false, type: 'string' },
];

/**
 * Ce que le panier du tunnel de commande réclamerait : les labels de la colonne « API field » de
 * BKP-1208. Graphies non confirmées côté catalogue (cf. spec order-subscription, technical.md) —
 * écrites en clair ici pour qu'un changement de contrat fasse échouer le test bruyamment.
 */
export const mockOrderFunnelRequiredConfiguration: CartItemRequiredConfiguration[] = [
  { fields: null, label: 'displayName', required: true, type: 'string' },
  { fields: null, label: 'backupServerExternalIp', required: true, type: 'string' },
  { fields: null, label: 'backupServerPrivateIp', required: false, type: 'string' },
  { fields: null, label: 'vaultDisplayName', required: true, type: 'string' },
  { fields: null, label: 'region', required: true, type: 'string' },
  { fields: null, label: 'licenseType', required: true, type: 'string' },
];

export const mockCartCheckout: Order = {
  contracts: [
    {
      content: 'test contract content',
      name: 'Test contract',
      url: 'https://example.test/contract',
    },
  ],
  details: [],
  orderId: 42,
  prices: {
    originalWithoutTax: { currencyCode: 'EUR', text: '42.42 € (test)', value: 42.42 },
    reduction: { currencyCode: 'EUR', text: '0.00 € (test)', value: 0 },
    tax: { currencyCode: 'EUR', text: '8.48 € (test)', value: 8.48 },
    withTax: { currencyCode: 'EUR', text: '50.90 € (test)', value: 50.9 },
    withoutTax: { currencyCode: 'EUR', text: '42.42 € (test)', value: 42.42 },
  },
  url: 'https://example.test/order/42',
};
