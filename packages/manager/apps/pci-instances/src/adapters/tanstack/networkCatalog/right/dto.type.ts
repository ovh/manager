export type TPriceDTO = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

export type TPricingDTO = {
  regions: string[];
  price: TPriceDTO;
};

export type TRouterModelDTO = {
  name: string;
  pricings: TPricingDTO[];
};

export type TIpModelDTO = {
  type: 'PublicIP' | 'FloatingIP';
  pricings: TPricingDTO[];
};

export type TNetworkCatalogDTO = {
  routersModels: TRouterModelDTO[];
  ipModels: TIpModelDTO[];
};
