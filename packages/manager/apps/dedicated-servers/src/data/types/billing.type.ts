type Strategy =
  | 'CANCEL_SERVICE'
  | 'REACTIVATE_ENGAGEMENT'
  | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
  | 'STOP_ENGAGEMENT_KEEP_PRICE';
type LifecycleAction =
  | 'earlyRenewal'
  | 'terminate'
  | 'terminateAtEngagementDate'
  | 'terminateAtExpirationDate';
type PricingType = 'consumption' | 'purchase' | 'rental';
type RenewMode = 'automatic' | 'manual';
type EngagementType = 'periodic' | 'upfront';
type ResourceState =
  | 'active'
  | 'deleted'
  | 'suspended'
  | 'toActivate'
  | 'toDelete'
  | 'toSuspend';
type CustomerContactType = 'administrator' | 'billing' | 'technical';

interface EngagementEndRule {
  possibleStrategies: Strategy[];
  strategy: Strategy;
}

interface Engagement {
  endDate: string | null;
  endRule: EngagementEndRule | null;
}

interface EngagementRequest {
  pricingMode: string;
  requestDate: string;
  expirationDate?: string | null;
}

interface BillingGroup {
  id: number;
}

interface LifecycleCapacities {
  actions: LifecycleAction[];
}

interface LifecycleCurrent {
  creationDate: string | null;
  pendingActions: LifecycleAction[];
  state:
    | 'active'
    | 'error'
    | 'rupture'
    | 'terminated'
    | 'toRenew'
    | 'unpaid'
    | 'unrenewed';
  terminationDate: string | null;
}

interface Lifecycle {
  capacities: LifecycleCapacities;
  current: LifecycleCurrent;
}

interface Plan {
  code: string;
  invoiceName: string;
}

interface Price {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
}

interface Pricing {
  capacities: PricingType[];
  description: string;
  duration: string;
  engagementConfiguration?: {
    defaultEndAction: Strategy;
    duration: string;
    type: EngagementType;
  } | null;
  interval: number;
  maximumQuantity: number | null;
  maximumRepeat: number | null;
  minimumQuantity: number;
  minimumRepeat: number;
  price: Price;
  priceInUcents: number;
  pricingMode: string;
  pricingType: PricingType;
}

interface RenewCapacities {
  mode: RenewMode[];
}

interface RenewCurrent {
  mode: RenewMode | null;
  nextDate: string | null;
  period: string | null;
}

interface Renew {
  capacities: RenewCapacities;
  current: RenewCurrent;
}

interface Billing {
  engagement: Engagement | null;
  engagementRequest: EngagementRequest | null;
  expirationDate: string | null;
  group: BillingGroup | null;
  lifecycle: Lifecycle;
  nextBillingDate: string | null;
  plan: Plan | null;
  pricing: Pricing | null;
  renew: Renew | null;
}

interface CustomerContact {
  customerCode: string;
  type: CustomerContactType;
}

interface Customer {
  contacts: CustomerContact[];
}

interface Product {
  description: string;
  name: string;
}

interface Resource {
  displayName: string;
  name: string;
  product: Product | null;
  resellingProvider: string | null;
  state: ResourceState;
}

interface RouteVar {
  key: string;
  value: string;
}

interface Route {
  path: string | null;
  url: string | null;
  vars: RouteVar[];
}

export interface BillingInfo {
  billing: Billing;
  customer: Customer;
  parentServiceId: number | null;
  resource: Resource;
  route: Route | null;
  serviceId: number;
  tags: string[];
}
