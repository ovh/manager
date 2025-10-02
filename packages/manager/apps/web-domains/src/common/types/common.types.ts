import {
  LifecycleCapacitiesEnum,
  ServiceInfoRenewModeEnum,
} from '@/common/enum/common.enum';
import {
  ActionsEnum,
  CapacitiesEnum,
  ContactTypeEnum,
  CurrencyCodeEnum,
  DefaultEndActionEnum,
  EngagementConfigurationTypeEnum,
  ModeEnum,
  PossibleStrategiesEnum,
  PricingTypeEnum,
  ResellingProviderEnum,
  ResourceStateEnum,
  StateEnum,
} from '../enum/option.enum';

export interface TServiceInfo {
  serviceId: number;
  billing: {
    expirationDate: string | null;
    renew?: {
      current: {
        mode: ServiceInfoRenewModeEnum | null;
        nextDate: string;
      };
    } | null;
    lifecycle?: {
      current: {
        creationDate: string | null;
        pendingActions: LifecycleCapacitiesEnum[];
      };
    } | null;
  };
  customer?: {
    contacts: {
      customerCode: string;
      type: string;
    }[];
  };
  resource: {
    name: string;
  };
}

export interface TServiceOption {
  billing: TBilling;
  customer: TCustomer;
  parentServiceId: number | null;
  resource: TResource;
  route: {
    path: string;
    url: string;
    vars: {
      [key: string]: string;
    }[];
  } | null;
  serviceId: number;
  tags: string[];
}

interface TResource {
  displayName: string;
  name: string;
  product: {
    description: string;
    name: string;
  };
  resellingProvider: ResellingProviderEnum;
  state: ResourceStateEnum;
}

interface TCustomer {
  contacts: {
    customerCode: string;
    type: ContactTypeEnum;
  };
}

interface TBilling {
  engagement: TEngagement;
  engagementRequest: TEngagementRequest;
  expirationDate: string;
  group: {
    id: number;
  };
  lifecycle: TLifecyle;
  nextBillingDate: string;
  plan: {
    code: string;
    invoiceName: string;
  };
  princing: TPricing;
  renew: {
    capacities: {
      mode: ModeEnum[];
    };
    current: {
      mode: ModeEnum;
      nextDate: string | null;
      period: string | null;
    };
  };
}

interface TEngagement {
  endDate: string;
  endRule: {
    possibleStrategies: PossibleStrategiesEnum;
    strategy: PossibleStrategiesEnum[];
  };
}

interface TEngagementRequest {
  princingMode: string;
  requestDate: string;
}

interface TLifecyle {
  capacities: {
    actions: ActionsEnum[];
  };
  current: {
    creationDate: string;
    pendingActions: ActionsEnum[];
    state: StateEnum;
    terminationDate: string;
  };
}

interface TPricing {
  capacities: CapacitiesEnum;
  description: string;
  duration: string;
  engagementConfiguration: {
    defaultEndAction: DefaultEndActionEnum;
    duration: string;
    type: EngagementConfigurationTypeEnum;
  };
  interval: number;
  maximumQuantity: number | null;
  maximumRepeat: number | null;
  minimumQuantity: number;
  minimumRepeat: number;
  price: {
    currencyCode: CurrencyCodeEnum;
    priceInUcents: number;
    text: string;
    value: number;
  };
  priceInUcents: number;
  pricingMode: string;
  pricingType: PricingTypeEnum;
}
