import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';
import { TServiceInfo } from '@/common/types/common.types';

export const serviceInfoAuto: TServiceInfo = {
  serviceId: 1111111,
  billing: {
    expirationDate: '2026-02-01',
    renew: {
      current: {
        mode: ServiceInfoRenewModeEnum.Automatic,
        nextDate: '2024-09-25T06:40:26Z',
      },
    },
    lifecycle: {
      current: {
        creationDate: '2024-09-25T06:40:26Z',
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
    name: 'example.com',
  },
};

export const serviceInfoManuel: TServiceInfo = {
  serviceId: 1111111,
  billing: {
    expirationDate: '2026-02-01',
    renew: {
      current: {
        mode: ServiceInfoRenewModeEnum.Manual,
        nextDate: '2024-09-25T06:40:26Z',
      },
    },
    lifecycle: {
      current: {
        creationDate: '2024-09-25T06:40:26Z',
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
    name: 'example.com',
  },
};
