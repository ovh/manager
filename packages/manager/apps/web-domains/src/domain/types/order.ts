export type OrderProduct = {
  planCode: string;
  zoneName: string;
  dnssec?: boolean;
  activateZone?: boolean;
};

export type OrderProductBody = {
  planCode: string;
  quantity: number;
  option?: OptionProduct[];
  zoneName?: string;
  dnssec?: boolean;
  activateZone?: boolean;
  duration: string;
  productId: string;
  pricingMode: string;
  configuration?: ProductConfiguration[];
  serviceName?: string;
};

type OptionProduct = {
  planCode: string;
  duration: string;
  quantity: number;
  pricingMode: string;
};

type ProductConfiguration = {
  label: string;
  value: string;
};
