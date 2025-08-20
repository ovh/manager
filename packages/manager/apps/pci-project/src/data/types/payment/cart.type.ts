export type TCart = {
  cartId: string;
  prices: {
    withTax: {
      value: number;
    };
  };
  url: string | null;
};

export type TCartOptionPayload = {
  duration: string;
  itemId: number;
  planCode: string;
  pricingMode: string;
  quantity: number;
};

export type TPrice = {
  value: number;
  currencyCode: string;
  text: string;
};

export type TCartProductPrice = {
  capacities: string[];
  description: string;
  duration: string;
  interval: number;
  maximumQuantity: number;
  maximumRepeat: number;
  minimumQuantity: number;
  minimumRepeat: number;
  price: TPrice;
  priceInUcents: number;
  pricingMode: string;
  pricingType: string;
};

export type TCartProductOption = {
  planCode: string;
  prices: TCartProductPrice[];
};
