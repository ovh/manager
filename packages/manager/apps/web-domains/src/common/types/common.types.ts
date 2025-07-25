import { LifecycleCapacitiesEnum, ServiceInfoRenewModeEnum } from "@/common/enum/common.enum";
import { ActionsEnum, CapacitiesEnum, ContactTypeEnum, CurrencyCodeEnum, DefaultEndActionEnum, EngagementConfigurationTypeEnum, ModeEnum, PossibleStrategiesEnum, PricingTypeEnum, ResellingProviderEnum, ResourceStateEnum, StateEnum } from "../enum/option.enum";

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
      };
      capacities: {
        actions: LifecycleCapacitiesEnum[];
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
  tags: string[]
}

interface TResource {
  displayName: string;
  name: string;
  product: {
    description: string;
    name: string;
  }
  resellingProvider: keyof typeof ResellingProviderEnum;
  state: keyof typeof ResourceStateEnum;
}

interface TCustomer {
  contacts : {
    customerCode: string
    type: keyof typeof ContactTypeEnum;
  }
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
      mode: keyof typeof ModeEnum[];
    };
    current: {
      mode: keyof typeof ModeEnum;
      nextDate: string | null;
      period: string | null;
    };
  };
}

interface TEngagement {
  endDate: string;
  endRule: {
    possibleStrategies: keyof typeof PossibleStrategiesEnum;
    strategy: keyof typeof PossibleStrategiesEnum[];
  };
}

interface TEngagementRequest {
  princingMode: string;
  requestDate: string;
}

interface TLifecyle {
  capacities: {
    actions: keyof typeof ActionsEnum[];
  };
  current: {
    creationDate: string;
    pendingActions: keyof typeof ActionsEnum[];
    state: keyof typeof StateEnum;
    terminationDate: string;
  };
}

interface TPricing {
  capacities: keyof typeof CapacitiesEnum;
  description: string;
  duration: string;
  engagementConfiguration: {
    defaultEndAction: keyof typeof DefaultEndActionEnum;
    duration: string;
    type: keyof typeof EngagementConfigurationTypeEnum;
  };
  interval: number;
  maximumQuantity: number | null;
  maximumRepeat: number | null;
  minimumQuantity: number;
  minimumRepeat: number;
  price: {
    currencyCode: keyof typeof CurrencyCodeEnum;
    priceInUcents: number;
    text: string;
    value: number;
  };
  priceInUcents: number;
  pricingMode: string;
  pricingType: keyof typeof PricingTypeEnum;
}
