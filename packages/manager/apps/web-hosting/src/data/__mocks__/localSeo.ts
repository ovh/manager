import { LocalSeoType, SeoCountry, SeoOffer } from '../types/product/seo';
import { SeoStatus } from '../types/status';

export const localSeoMocks: LocalSeoType[] = [
  {
    accountId: 5424,
    address: '2 rue Kellermann 59100 Roubaix',
    country: SeoCountry.FR,
    creationDate: '2025-08-25T13:17:39.620Z',
    id: '0',
    lastUpdate: '2025-08-25T13:17:39.620Z',
    name: 'Mon entreprise de test',
    offer: SeoOffer.NORMAL,
    status: SeoStatus.CREATED,
    taskId: 0,
  },
];
