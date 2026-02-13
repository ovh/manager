export type TPricingDTO = {
  price: number;
  intervalUnit: 'hour' | 'month' | 'none';
};

export type TPlanDTO = {
  planCode: string;
  product: string;
  pricings: TPricingDTO[];
};

export type TLoadBalancerCatalogDTO = {
  addons: TPlanDTO[];
};
