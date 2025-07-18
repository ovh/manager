import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewMode,
} from '@/alldoms/enum/service.enum';
import { TServiceInfo } from '@/alldoms/types';

export const serviceInfo: TServiceInfo = {
  serviceId: 1111111,
  billing: {
    expirationDate: '2026-02-01',
    renew: {
      current: {
        mode: ServiceInfoRenewMode.Automatic,
        nextDate: '2024-09-25T06:40:26Z',
      },
    },
    lifecycle: {
      current: {
        creationDate: '2024-09-25T06:40:26Z',
        pendingActions: [LifecycleCapacitiesEnum.EarlyRenewal],
      },
      capacities: {
        actions: [],
      },
    },
  },
  customer: {
    contacts: [
      {
        customerCode: 'aa00001-ovh',
        type: 'administrator',
      },
      {
        customerCode: 'aa00001-ovh',
        type: 'technical',
      },
      {
        customerCode: 'aa00001-ovh',
        type: 'billing',
      },
    ],
  },
  resource: {
    name: 'alldom-french-international-example',
  },
};
