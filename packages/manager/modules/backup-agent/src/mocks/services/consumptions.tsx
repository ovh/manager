import { ServiceConsumption } from '@/types/Consumption.type';

export const mockServiceConsumption: ServiceConsumption[] = [
  {
    metadata: null,
    planCode: 'backup-vault-paygo-consumption',
    planFamily: '',
    price: { currencyCode: 'EUR', text: '0.15 €', value: 0.15 },
    quantity: 500,
    uniqueId: '',
    beginDate: null,
    endDate: null,
    pricingMode: '',
  },
  {
    metadata: null,
    planCode: 'backup-vault-paygo-other',
    planFamily: '',
    price: { currencyCode: 'EUR', text: '1.00 €', value: 1.0 },
    quantity: 21,
    uniqueId: '',
    beginDate: null,
    endDate: null,
    pricingMode: '',
  },
  {
    metadata: null,
    planCode: 'backup-vault-paygo-test',
    planFamily: '',
    price: { currencyCode: 'EUR', text: '10000.15 €', value: 100000.15 },
    quantity: 1000,
    uniqueId: '',
    beginDate: null,
    endDate: null,
    pricingMode: '',
  },
];
