export type TLoadBalancerFlavor = {
  id: string;
  name: string;
  region: string;
};

type TPrice = {
  priceInUcents: number;
  type: 'hour' | 'month' | 'none';
};

export type TLoadBalancerFlavorWithPricing = TLoadBalancerFlavor & { pricing: TPrice[] };
