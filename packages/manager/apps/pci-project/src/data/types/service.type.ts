export type TServiceRoute = {
  url: string;
  path: string;
  vars: Array<{
    key: string;
    value: string;
  }>;
};

export type TServiceBillingState =
  | 'active'
  | 'toRenew'
  | 'error'
  | 'unpaid'
  | 'unrenewed'
  | 'rupture'
  | 'terminated';

export type TServicePrice = {
  text: string;
  value: number;
  currencyCode: string;
};

export type TServicePricing = {
  price: TServicePrice;
  duration: string;
  interval: number;
  capacities: string[];
  description: string;
  pricingMode: string;
  pricingType: string;
  maximumRepeat: number | null;
  minimumRepeat: number;
  priceInUcents: number;
  maximumQuantity: number;
  minimumQuantity: number;
};

export type TServiceRenewCurrent = {
  mode: string;
  period: string;
  nextDate: string;
};

export type TServiceRenewCapacities = {
  mode: string[];
};

export type TServiceRenew = {
  current: TServiceRenewCurrent;
  capacities: TServiceRenewCapacities;
};

export type TServiceLifecycleCurrent = {
  state: TServiceBillingState;
  creationDate: string;
  terminationDate: string | null;
};

export type TServiceLifecycleCapacities = {
  actions: string[];
};

export type TServiceLifecycle = {
  current: TServiceLifecycleCurrent;
  capacities: TServiceLifecycleCapacities;
};

export type TServicePlan = {
  code: string;
  invoiceName: string;
};

export type TServiceBilling = {
  plan: TServicePlan;
  renew: TServiceRenew | null;
  pricing: TServicePricing;
  lifecycle: TServiceLifecycle;
  expirationDate: string;
  nextBillingDate: string;
};

export type TServiceContact = {
  type: string;
  customerCode: string;
};

export type TServiceCustomer = {
  contacts: TServiceContact[];
};

export type TServiceProduct = {
  name: string;
  description: string;
};

export type TServiceResource = {
  name: string;
  state: string;
  product: TServiceProduct;
  displayName: string;
};

export type TService = {
  route: TServiceRoute;
  billing: TServiceBilling;
  customer: TServiceCustomer;
  resource: TServiceResource;
  serviceId: number;
  parentServiceId: number | null;
  contactAdmin?: string;
  contactBilling?: string;
  contactTech?: string;
};

export type TServiceOption = TService;

export type TCartServiceOption = {
  mandatory: boolean;
  exclusive: boolean;
  productName: string;
  planCode: string;
  family: string;
  productType: string;
  prices: {
    pricingMode: string;
    description: string;
    duration: string;
    minimumRepeat: number;
    minimumQuantity: number;
    priceInUcents: number;
    maximumQuantity: number | null;
    interval: number;
    capacities: string[];
    maximumRepeat: number | null;
    price: {
      currencyCode: string;
      text: string;
      value: number;
    };
  }[];
};
