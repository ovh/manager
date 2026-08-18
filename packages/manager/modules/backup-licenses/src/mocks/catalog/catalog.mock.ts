import { OrderCatalog } from '@/types/Catalog.type';

export const VAULT_STORAGE_PRICE_IN_UCENTS = 700_000;

const consumptionPricing = {
  capacities: ['consumption'],
  mode: 'default',
  commitment: 0,
  intervalUnit: 'none',
  interval: 0,
  price: VAULT_STORAGE_PRICE_IN_UCENTS,
  tax: 140_000,
};

const freeRentalPricings = [
  {
    capacities: ['installation'],
    mode: 'default',
    commitment: 0,
    intervalUnit: 'none',
    interval: 0,
    price: 0,
    tax: 0,
  },
  {
    capacities: ['renew'],
    mode: 'default',
    commitment: 0,
    intervalUnit: 'month',
    interval: 1,
    price: 0,
    tax: 0,
  },
];

export const mockBackupServicesCatalog: OrderCatalog = {
  locale: { currencyCode: 'EUR', taxRate: 20 },
  plans: [{ planCode: 'backup-tenant', pricings: freeRentalPricings }],
  addons: [
    {
      planCode: 'backup-vault-backuplicenses-500G',
      pricings: freeRentalPricings,
    },
    {
      planCode: 'backup-vault-backuplicenses-paygo',
      pricings: freeRentalPricings,
    },
    {
      planCode: 'backup-vault-backuplicenses-500g-consumption',
      pricings: [consumptionPricing],
    },
    {
      planCode: 'backup-vault-backuplicenses-paygo-consumption',
      pricings: [consumptionPricing],
    },
  ],
};

export const mockCatalogWithoutVaultStorage: OrderCatalog = {
  ...mockBackupServicesCatalog,
  addons: mockBackupServicesCatalog.addons.filter(
    ({ planCode }) => !planCode.endsWith('-consumption'),
  ),
};
