import { VrackServiceInfos } from '../src/data/api';

export const expiredService: VrackServiceInfos = {
  serviceId: 1,
  status: 'expired',
  domain: 'domain',
  creation: '2024-01-01',
  contactTech: 'tech',
  contactAdmin: 'admin',
  contactBilling: 'billing',
};

export const availableService = {
  serviceId: 1,
  status: 'ok',
  domain: 'domain',
  creation: '2024-01-01',
  contactTech: 'tech',
  contactAdmin: 'admin',
  contactBilling: 'billing',
};
