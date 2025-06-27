export type TOrderCatalog = {
  plans: TCommercialOffer[];
};

export type TAddonFamily = {
  addons: string[];
  default: string | null;
  exclusive: boolean | null;
  mandatory: boolean | null;
  name: string;
};

export type TConfiguration = {
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

export type TConsumptionConfiguration = {
  billingStrategy: 'custom' | 'diff' | 'max' | 'max_retain' | 'ping' | 'sum';
  pingEndPolicy: 'full' | 'prorata' | null;
  prorataUnit: 'day' | 'hour' | 'month';
};

export type TPricingCapacity =
  | 'consumption'
  | 'detach'
  | 'downgrade'
  | 'dynamic'
  | 'installation'
  | 'renew'
  | 'upgrade';

export type TEngagementConfiguration = {
  defaultEndAction:
    | 'CANCEL_SERVICE'
    | 'REACTIVATE_ENGAGEMENT'
    | 'STOP_ENGAGEMENT_FALLBACK_DEFAULT_PRICE'
    | 'STOP_ENGAGEMENT_KEEP_PRICE';
  duration: string; // duration format
  type: 'periodic' | 'upfront';
};

export type TQuantity = {
  max: number | null;
  min: number;
};

export type TRepeat = {
  max: number | null;
  min: number;
};

export type TAmount = {
  tax: number;
  value: number;
};

export type TPromotion = {
  description: string;
  discount: TAmount;
  duration: number | null;
  endDate: string | null; // date-time
  isGlobalQuantityLimited: boolean;
  name: string;
  quantity: number | null;
  startDate: string; // date-time
  tags: string[];
  total: TAmount;
  type: 'fixed_amount' | 'forced_amount' | 'percentage';
  value: number;
};

export type TPricing = {
  capacities: TPricingCapacity[];
  commitment: number;
  description: string;
  engagementConfiguration: TEngagementConfiguration | null;
  interval: number;
  intervalUnit: 'day' | 'hour' | 'month' | 'none';
  mode: string;
  mustBeCompleted: boolean;
  phase: number;
  price: number;
  promotions: TPromotion[];
  quantity: TQuantity;
  repeat: TRepeat;
  strategy: 'stairstep' | 'tiered' | 'volume';
  tax: number;
  type: 'consumption' | 'purchase' | 'rental';
};

export type TCommercialOffer = {
  addonFamilies: TAddonFamily[];
  configurations: TConfiguration[];
  consumptionConfiguration: TConsumptionConfiguration | null;
  family: string | null;
  invoiceName: string;
  planCode: string;
  pricingType: 'consumption' | 'purchase' | 'rental';
  pricings: TPricing[];
  product: string;
};
