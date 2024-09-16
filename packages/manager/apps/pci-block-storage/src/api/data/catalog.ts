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
