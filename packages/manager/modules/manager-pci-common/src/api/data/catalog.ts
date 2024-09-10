import { v6 } from '@ovh-ux/manager-core-api';

export type TPricing = {
  capacities: string[];
  mode: string;
  phase: number;
  commitment: number;
  description: string;
  price: {
    currencyCode: string;
    text: string;
    value: number;
  };
  tax: number;
  interval: number;
  intervalUnit: string;
  quantity: {
    max?: number;
    min?: number;
  };
  repeat: {
    max?: number;
    min?: number;
  };
  strategy: string;
  mustBeCompleted: boolean;
  type: string;
  promotions: unknown[];
  engagementConfiguration?: unknown;
};

export type TAddonFamily = {
  addons: string[];
  default?: string;
  name: string;
  exclusive: boolean;
  mandatory: boolean;
};

export type TPlan = {
  planCode: string;
  invoiceName: string;
  product: string;
  pricingType: string;
  consumptionConfiguration: string;
  pricings: TPricing[];
  addonFamilies: TAddonFamily[];
};

export type TCatalog = {
  catalogId: string;
  locale: {
    currencyCode: string;
    subsidiary: string;
    taxRate: number;
  };
  plans: TPlan[];
  addons: TAddon[];
};

export type TAddon = {
  planCode: string;
  blobs: {
    tags: string[];
    technical: {
      bandwidth?: {
        guaranteed: boolean;
        level: number;
        max: number;
        unit: string;
        unlimited: boolean;
      };
      cpu?: {
        boost: number;
        brand: string;
        cores: number;
        customizable: boolean;
        frequency: number;
        maxFrequency: number;
        model: string;
        number: number;
        score: number;
        threads: number;
        type: string;
      };
      gpu: {
        brand?: string;
        memory: {
          customizable?: boolean;
          ecc?: boolean;
          frequency?: number;
          interface?: string;
          ramType?: string;
          size?: number;
          sizeUnit?: string;
        };
        model?: string;
        number?: number;
        performance?: number;
      };
      nvme?: {
        disks: {
          capacity: number;
          number: number;
          sizeUnit: string;
          technology: string;
        }[];
      };
      storage?: {
        disks: {
          capacity: number;
          number: number;
          sizeUnit: string;
          technology: string;
        }[];
      };
      volume?: {
        iops: {
          level: number;
          max: number;
          guaranteed: boolean;
          unit: string;
          maxUnit: string;
        };
        capacity: {
          max: number;
        };
      };
      name: string;
    };
  };
  pricings: {
    price: number;
    type: string;
    capacities: string[];
  }[];
};

export const getCatalog = async (ovhSubsidiary: string): Promise<TCatalog> => {
  const { data } = await v6.get<TCatalog>(
    `/order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}`,
  );

  return data;
};
