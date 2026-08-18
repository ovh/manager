import { Cart, Item, Order } from '@ovh-ux/manager-module-order';

import {
  CartItemRequiredConfiguration,
  CartOfferDefinition,
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

/** Le seul tarif commandable de l'offre vault : celui que la commande et l'affichage lisent tous deux. */
export const mockVaultOfferInstallationPricing = buildTestOfferPricing(
  TEST_VAULT_OFFER_PRICE_IN_UCENTS,
);

export const mockVaultServiceOffer: CartServiceOffer = {
  exclusive: false,
  family: 'vault',
  mandatory: false,
  planCode: PAYGO_VAULT_PLAN_CODE,
  prices: [
    mockVaultOfferInstallationPricing,
    buildTestOfferPricing(TEST_VAULT_OFFER_PRICE_IN_UCENTS, { capacities: ['upgrade'] }),
  ],
  productName: 'Backup Licenses PAYGO vault',
  productType: 'storage',
};

/** Ni `installation` ni `renew` : un changement de gamme ne se commande pas depuis le tunnel. */
export const mockUnorderableServiceOffer: CartServiceOffer = {
  exclusive: false,
  family: 'license',
  mandatory: false,
  planCode: 'vspc-tenant-backuplicenses',
  prices: [buildTestOfferPricing(TEST_TENANT_OFFER_PRICE_IN_UCENTS, { capacities: ['upgrade'] })],
  productName: 'Backup Licenses VSPC tenant',
  productType: 'saas_license',
};

export const mockCartServiceOffers: CartServiceOffer[] = [
  mockVaultServiceOffer,
  mockUnorderableServiceOffer,
];

export const mockCartServiceOffersWithoutVault: CartServiceOffer[] = [mockUnorderableServiceOffer];

/**
 * Ce que le panier du tunnel offrirait. Les plan codes de BKP-1208 sont écrits en clair, comme
 * `mockOrderFunnelRequiredConfiguration` : si la composition change, le test le dit bruyamment.
 */
export const mockCartProductDefinitions: CartOfferDefinition[] = [
  {
    planCode: 'backup-tenant',
    prices: [buildTestOfferPricing(TEST_TENANT_OFFER_PRICE_IN_UCENTS)],
    productName: 'Backup Licenses tenant',
    productType: 'saas_license',
  },
];

const buildTestOptionDefinition = (
  planCode: string,
  family: string,
  pricing: Partial<CartOfferPricing> = {},
): CartServiceOffer => ({
  exclusive: false,
  family,
  mandatory: false,
  planCode,
  prices: [buildTestOfferPricing(TEST_TENANT_OFFER_PRICE_IN_UCENTS, pricing)],
  productName: `Backup Licenses ${planCode}`,
  productType: 'saas_license',
});

/**
 * Deux des trois addons annoncent volontairement autre chose que le mensuel `default`/`P1M` à
 * l'unité : c'est ce que la commande doit reprendre de l'offre, et non ce qu'elle supposerait.
 */
export const mockCartOptionDefinitions: CartServiceOffer[] = [
  buildTestOptionDefinition('vspc-tenant', 'vspc'),
  buildTestOptionDefinition('vspc-tenant-backuplicenses', 'license', {
    pricingMode: 'consumption',
  }),
  buildTestOptionDefinition('backup-vault-backuplicenses-500G', 'vault', {
    duration: 'P1Y',
    minimumQuantity: 2,
  }),
];

export const mockCartOptionDefinitionsWithoutBundledVault: CartServiceOffer[] =
  mockCartOptionDefinitions.slice(0, 2);

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
  { fields: null, label: 'vault-name', required: true, type: 'String' },
  { fields: null, label: 'vault-azname', required: false, type: 'String' },
  { fields: null, label: 'TECH_ACCOUNT', required: false, type: 'Nichandle' },
  { fields: null, label: 'ADMIN_ACCOUNT', required: false, type: 'Nichandle' },
];

/**
 * Ce que le panier du tunnel réclame, relevé item par item sur un panier réel (labeu, 2026-08-06) —
 * l'union des labels, le handler servant la même réponse à tous les items. Les deux comptes
 * `Nichandle` que le panier réclame sans les exiger doivent rester ignorés sans bloquer.
 */
export const mockOrderFunnelRequiredConfiguration: CartItemRequiredConfiguration[] = [
  { fields: null, label: 'backupserver-public-ip', required: true, type: 'String' },
  { fields: null, label: 'backupserver-private-ip', required: false, type: 'String' },
  { fields: null, label: 'license-type', required: true, type: 'String' },
  { fields: null, label: 'vault-azname', required: false, type: 'String' },
  { fields: null, label: 'TECH_ACCOUNT', required: false, type: 'Nichandle' },
  { fields: null, label: 'ADMIN_ACCOUNT', required: false, type: 'Nichandle' },
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
