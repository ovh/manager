/**
 * Jeux de données de développement pour l'onglet « Facturation » (BKP-1225).
 * Clés : en mock, `resolveServiceId` (cf. `billing.queries.ts`) renvoie directement le
 * `resourceName` du vault/de la licence — les jeux de test n'ont pas de service Agora réel
 * à résoudre. À supprimer une fois l'endpoint déployé (cf. §15 de la spec).
 */
import { ServiceConsumption } from '@/types/Consumption.type';

const PERIOD = { beginDate: '2026-07-01T00:00:00Z', endDate: '2026-07-31T23:59:59Z' };

export const mockStorageConsumptions: Record<string, ServiceConsumption[]> = {
  'vault-veeam-multi-region': [
    {
      ...PERIOD,
      pricingMode: 'consumption',
      quantity: 487,
      planCode: 'backup-vault-backuplicenses-500g-consumption',
      planFamily: 'backup',
      price: { currencyCode: 'EUR', text: '0,00 €', value: 0 },
      uniqueId: null,
    },
  ],
  'vault-veeam-paris': [
    {
      ...PERIOD,
      pricingMode: 'consumption',
      quantity: 7,
      planCode: 'backup-vault-backuplicenses-paygo-consumption',
      planFamily: 'backup',
      price: { currencyCode: 'EUR', text: '0,05 €', value: 5000000 },
      uniqueId: null,
    },
  ],
  'vault-veeam-london': [
    {
      ...PERIOD,
      pricingMode: 'consumption',
      quantity: 142,
      planCode: 'backup-vault-backuplicenses-paygo-consumption',
      planFamily: 'backup',
      price: { currencyCode: 'EUR', text: '0,99 €', value: 99000000 },
      uniqueId: null,
    },
  ],
};

export const mockLicenseConsumptions: Record<string, ServiceConsumption[]> = {
  'license-1': [
    {
      ...PERIOD,
      pricingMode: 'consumption',
      quantity: 1,
      planCode: 'backup-license-backuplicenses-foundation',
      planFamily: 'backup',
      price: { currencyCode: 'EUR', text: '4,90 €', value: 490000000 },
      uniqueId: null,
    },
  ],
  'license-2': [
    {
      ...PERIOD,
      pricingMode: 'consumption',
      quantity: 1,
      planCode: 'backup-license-backuplicenses-advanced',
      planFamily: 'backup',
      price: { currencyCode: 'EUR', text: '9,90 €', value: 990000000 },
      uniqueId: null,
    },
  ],
  'license-3': [
    {
      ...PERIOD,
      pricingMode: 'consumption',
      quantity: 1,
      planCode: 'backup-license-backuplicenses-premium',
      planFamily: 'backup',
      price: { currencyCode: 'EUR', text: '14,90 €', value: 1490000000 },
      uniqueId: null,
    },
  ],
};
