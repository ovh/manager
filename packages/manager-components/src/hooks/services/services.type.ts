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

export type RenewMode = 'automatic' | 'manual';

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
        createDate: string;
        pendingActions: LifecycleAction[];
        state:
          | 'active'
          | 'error'
          | 'rupture'
          | 'terminated'
          | 'toRenew'
          | 'unpaid'
          | 'unrenewed';
        terminationDate: string;
      };
    };
    nextBillingDate: string;
    plan: {
      code: string;
      invoiceName: string;
    };
    pricing: {
      capacities:
        | 'consumption'
        | 'detach'
        | 'downgrade'
        | 'dynamic'
        | 'installation'
        | 'renew'
        | 'upgrade';
      description: string;
      duration: string;
      engagementConfiguration: {
        defaultEndAction:
          | 'CANCEL_SERVICE'
          | 'REACTIVATE_ENGAGEMENT'
          | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
          | 'STOP_ENGAGEMENT_KEEP_PRICE';
        duration: string;
        type: 'periodic' | 'upfront';
      };
      interval: number;
      maximumQuantity: number | null;
      maximumRepeat: number | null;
      minimumQuantity: number;
      minimumRepeat: number;
      price: {
        currencyCode:
          | 'AUD'
          | 'CAD'
          | 'CZK'
          | 'EUR'
          | 'GBP'
          | 'INR'
          | 'LTL'
          | 'MAD'
          | 'N/A'
          | 'PLN'
          | 'SGD'
          | 'TND'
          | 'USD'
          | 'XOF'
          | 'points';
        priceInUcents: number | null;
        text: string;
        value: number;
      };
      priceInUcents: number;
      pricingMode: string;
      pricingType: 'consumption' | 'purchase' | 'rental';
    };
  };
  renew: {
    capacities: { mode: RenewMode[] };
    current: {
      mode: RenewMode | null;
      nextDate: string | null;
      period: string;
    };
  };
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
