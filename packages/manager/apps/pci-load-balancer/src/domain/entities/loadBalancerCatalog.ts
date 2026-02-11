export type TPrice = {
  priceInUcents: number;
  type: 'hour' | 'month' | 'none';
};

export type TLoadBalancerCatalog = {
  planCode: string;
  product: string;
  pricing: TPrice[];
};
