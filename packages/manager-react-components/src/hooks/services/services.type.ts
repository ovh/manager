import { CurrencyCode } from '../../enumTypes';

export type EndRuleStrategy =
  | 'CANCEL_SERVICE'
  | 'REACTIVATE_ENGAGEMENT'
  | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
  | 'STOP_ENGAGEMENT_KEEP_PRICE';

export type LifecycleAction =
  | 'earlyRenewal'
  | 'terminate'
  | 'terminateAtEngagementDate'
  | 'terminateAtExpirationDate';

export type LifecycleState =
  | 'active'
  | 'error'
  | 'rupture'
  | 'terminated'
  | 'toRenew'
  | 'unpaid'
  | 'unrenewed';

export type PricingCapacity =
  | 'consumption'
  | 'detach'
  | 'downgrade'
  | 'dynamic'
  | 'installation'
  | 'renew'
  | 'upgrade';

export type EndAction =
  | 'CANCEL_SERVICE'
  | 'REACTIVATE_ENGAGEMENT'
  | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
  | 'STOP_ENGAGEMENT_KEEP_PRICE';

export type RenewMode = 'automatic' | 'manual';

export type EngagementType = 'periodic' | 'upfront';

export type PricingType = 'consumption' | 'purchase' | 'rental';

export type CustomerContact = {
  customerCode: string;
  type: 'administrator' | 'billing' | 'technical';
};

export type ResourceStatus =
  | 'active'
  | 'deleted'
  | 'suspended'
  | 'toActivate'
  | 'toDelete'
  | 'toSuspend';

export type Renew = {
  current: CurrentRenew;
  capacities: RenewCapacities;
};

export type CurrentRenew = {
  mode: RenewMode | null;
  nextDate: string | null;
  period: string;
};

export type RenewCapacities = {
  mode: RenewMode[];
};

export type ServiceDetails = {
  billing: {
    engagement: {
      endDate: string | null;
      /**
       * Describes the rule applied at the end of the Engagement
       */
      endRule: {
        possibleStrategies: EndRuleStrategy[];
        strategy: EndRuleStrategy;
      };
    };
    engagementRequest: {
      pricingMode: string;
      requestDate: string;
    };
    expirationDate: string;
    group: {
      id: number;
    };
    lifecycle: {
      capacities: {
        actions: LifecycleAction[];
      };
      current: {
        creationDate: string;
        pendingActions: LifecycleAction[];
        state: LifecycleState;
        terminationDate: string;
      };
    };
    nextBillingDate: string;
    plan: {
      code: string;
      invoiceName: string;
    };
    pricing: {
      capacities: PricingCapacity;
      description: string;
      duration: string;
      engagementConfiguration: {
        defaultEndAction: EndAction;
        duration: string;
        type: EngagementType;
      };
      interval: number;
      maximumQuantity: number | null;
      maximumRepeat: number | null;
      minimumQuantity: number;
      minimumRepeat: number;
      price: {
        currencyCode: CurrencyCode;
        priceInUcents: number | null;
        text: string;
        value: number;
      };
      priceInUcents: number;
      pricingMode: string;
      pricingType: PricingType;
    };
    renew?: Renew;
  };
  renew?: Renew;
  customer: {
    contacts: CustomerContact[];
  };
  parentServiceId: number | null;
  resource: {
    displayName: string;
    name: string;
    product: {
      description: string;
      name: string;
    };
    resellingProvider: 'ovh.ca' | 'ovh.eu';
    state: ResourceStatus;
  };
  route: {
    path: string;
    url: string;
    vars: { key: string; value: string }[];
  };
  serviceId: number;
  tags: string[];
};
