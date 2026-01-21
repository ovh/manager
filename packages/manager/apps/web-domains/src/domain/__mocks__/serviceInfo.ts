import {
  BillingCapacitiesEnum,
  BillingTypeEnum,
  LifecycleCurrentStateEnum,
  PrincingTypeEnum,
  ServiceInfoRenewModeEnum,
} from '@/common/enum/common.enum';
import {
  CurrencyCodeEnum,
  DefaultEndActionEnum,
} from '@/common/enum/option.enum';
import { TServiceInfo } from '@/common/types/common.types';

export const serviceInfoAuto: TServiceInfo = {
  serviceId: 1111111,
  billing: {
    expirationDate: '2026-02-01',
    renew: {
      current: {
        mode: ServiceInfoRenewModeEnum.Automatic,
        nextDate: '2024-09-25T06:40:26Z',
        period: 'P1Y',
      },
    },
    lifecycle: {
      current: {
        creationDate: '2024-09-25T06:40:26Z',
        pendingActions: [],
        state: LifecycleCurrentStateEnum.Active,
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
        period: 'P1Y',
      },
    },
    lifecycle: {
      current: {
        creationDate: '2024-09-25T06:40:26Z',
        pendingActions: [],
        state: LifecycleCurrentStateEnum.Active,
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

export const serviceInfoPremium: TServiceInfo = {
  serviceId: 1111111,
  billing: {
    expirationDate: '2026-02-01',
    renew: {
      current: {
        mode: ServiceInfoRenewModeEnum.Automatic,
        nextDate: '2024-09-25T06:40:26Z',
        period: 'P1Y',
      },
    },
    lifecycle: {
      current: {
        creationDate: '2024-09-25T06:40:26Z',
        pendingActions: [],
        state: LifecycleCurrentStateEnum.Active,
      },
    },
    pricing: {
      pricingMode: 'premium',
      capacities: BillingCapacitiesEnum.Renew,
      description: '',
      duration: '1',
      engagementConfiguration: {
        defaultEndAction: DefaultEndActionEnum.REACTIVATE_ENGAGEMENT,
        duration: '',
        type: BillingTypeEnum.Periodic,
        interval: 1,
        minimumQuantity: 12,
        minimumRepeat: 12,
      },
      price: {
        currencyCode: CurrencyCodeEnum.EUR,
        text: '1',
        value: 1,
      },
      priceInUcents: 1,
      pricingType: PrincingTypeEnum.Purchase,
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

export const serviceInfoInCreation: TServiceInfo = {
  serviceId: 1111111,
  billing: {
    expirationDate: '2026-02-01',
    renew: {
      current: {
        mode: ServiceInfoRenewModeEnum.Automatic,
        nextDate: '2024-09-25T06:40:26Z',
        period: 'P1Y',
      },
    },
    lifecycle: {
      current: {
        creationDate: '2024-09-25T06:40:26Z',
        pendingActions: [],
        state: LifecycleCurrentStateEnum.InCreation,
      },
    },
    pricing: {
      pricingMode: 'premium',
      capacities: BillingCapacitiesEnum.Renew,
      description: '',
      duration: '1',
      engagementConfiguration: {
        defaultEndAction: DefaultEndActionEnum.REACTIVATE_ENGAGEMENT,
        duration: '',
        type: BillingTypeEnum.Periodic,
        interval: 1,
        minimumQuantity: 12,
        minimumRepeat: 12,
      },
      price: {
        currencyCode: CurrencyCodeEnum.EUR,
        text: '1',
        value: 1,
      },
      priceInUcents: 1,
      pricingType: PrincingTypeEnum.Purchase,
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
