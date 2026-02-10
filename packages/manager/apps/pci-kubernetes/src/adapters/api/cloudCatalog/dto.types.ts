export type TCloudCatalogLocaleDTO = {
  currencyCode: string;
  subsidiary: string;
  taxRate: number;
};

export type TCloudCatalogPricingDTO = {
  phase: number;
  capacities: Array<string>;
  commitment: number;
  description: string;
  interval: number;
  intervalUnit: string;
  quantity: {
    min: number;
    max: number | null;
  };
  repeat: {
    min: number;
    max: number | null;
  };
  price: number;
  formattedPrice: string;
  tax: number;
  mode: string;
  strategy: string;
  mustBeCompleted: boolean;
  type: string;
  promotions: Array<unknown>;
  engagementConfiguration: unknown;
};

export type TCloudCatalogConsumptionConfigurationDTO = {
  billingStrategy: string;
  prorataUnit: string;
  pingEndPolicy: unknown;
};

export type TCloudCatalogConfigurationDTO = {
  name: string;
  isCustom: boolean;
  isMandatory: boolean;
  values: Array<string> | null;
};

export type TCloudCatalogAddonFamilyDTO = {
  name: string;
  exclusive: boolean;
  mandatory: boolean;
  addons: Array<string>;
  default: string | null;
};

export type TCloudCatalogPlanDTO = {
  planCode: string;
  invoiceName: string;
  addonFamilies: Array<TCloudCatalogAddonFamilyDTO>;
  product: string;
  pricingType: string;
  consumptionConfiguration: TCloudCatalogConsumptionConfigurationDTO | null;
  pricings: Array<TCloudCatalogPricingDTO>;
  configurations: Array<TCloudCatalogConfigurationDTO>;
  family: string | null;
  blobs: unknown;
};

export type TCloudCatalogProductDTO = {
  name: string;
  description: string;
  blobs: unknown;
  configurations: Array<TCloudCatalogConfigurationDTO>;
};

export type TCloudCatalogAddonDTO = {
  planCode: string;
  invoiceName: string;
  addonFamilies: Array<unknown>;
  product: string;
  pricingType: string;
  consumptionConfiguration: {
    billingStrategy: string;
    prorataUnit: string;
    pingEndPolicy: string | null;
  };
  pricings: Array<{
    phase: number;
    capacities: Array<string>;
    commitment: number;
    description: string;
    interval: number;
    intervalUnit: string;
    quantity: {
      min: number;
      max: number | null;
    };
    repeat: {
      min: number;
      max: number | null;
    };
    price: number;
    formattedPrice: string;
    tax: number;
    mode: string;
    strategy: string;
    mustBeCompleted: boolean;
    type: string;
    promotions: Array<unknown>;
    engagementConfiguration: unknown;
  }>;
  configurations: Array<unknown>;
  family: string | null;
};

export type TCloudCatalogPlanFamilyDTO = {
  name: string;
};

export type TCloudCatalogResponseDTO = {
  catalogId: number;
  locale: TCloudCatalogLocaleDTO;
  plans: Array<TCloudCatalogPlanDTO>;
  products: Array<TCloudCatalogProductDTO>;
  addons: Array<TCloudCatalogAddonDTO>;
  planFamilies: Array<TCloudCatalogPlanFamilyDTO>;
};
