/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-module-common-api' or already moved
 */
import { CurrencyCode } from '../../enumTypes';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type EndRuleStrategy =
  | 'CANCEL_SERVICE'
  | 'REACTIVATE_ENGAGEMENT'
  | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
  | 'STOP_ENGAGEMENT_KEEP_PRICE';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type LifecycleAction =
  | 'earlyRenewal'
  | 'terminate'
  | 'terminateAtEngagementDate'
  | 'terminateAtExpirationDate';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type LifecycleState =
  | 'active'
  | 'error'
  | 'rupture'
  | 'terminated'
  | 'toRenew'
  | 'unpaid'
  | 'unrenewed';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type PricingCapacity =
  | 'consumption'
  | 'detach'
  | 'downgrade'
  | 'dynamic'
  | 'installation'
  | 'renew'
  | 'upgrade';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type EndAction =
  | 'CANCEL_SERVICE'
  | 'REACTIVATE_ENGAGEMENT'
  | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
  | 'STOP_ENGAGEMENT_KEEP_PRICE';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type RenewMode = 'automatic' | 'manual';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type EngagementType = 'periodic' | 'upfront';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type PricingType = 'consumption' | 'purchase' | 'rental';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type CustomerContact = {
  customerCode: string;
  type: 'administrator' | 'billing' | 'technical';
};

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type ResourceStatus =
  | 'active'
  | 'deleted'
  | 'suspended'
  | 'toActivate'
  | 'toDelete'
  | 'toSuspend';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
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
      } | null;
    } | null;
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
      capacities: PricingCapacity[];
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
        priceInUcents?: number | null;
        text: string;
        value: number;
      };
      priceInUcents?: number;
      pricingMode: string;
      pricingType: PricingType;
    };
    renew: {
      capacities: { mode: RenewMode[] };
      current: {
        mode: RenewMode | null;
        nextDate: string | null;
        period: string;
      };
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
