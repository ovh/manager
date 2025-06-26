export type Cart = {
  cartId: string;
  description: string;
  expire: string;
  readOnly: boolean;
};

export type CartDetail = {
  cartItemId: number;
  description: string;
  detailType: string;
  domain: string;
  quantity: number;
  reductions: unknown[];
  originalTotalPrice: Price;
  reductionTotalPrice: Price;
  totalPrice: Price;
  unitPrice: Price;
};

export type Price = {
  value: number;
  currencyCode: string;
  text: string;
};

export type CartContract = {
  name: string;
  url: string;
  content: string;
};

export type CartSummary = {
  orderId: number | null;
  url: string | null;
  details: CartDetail[];
  prices: {
    originalWithoutTax: Price;
    reduction: Price;
    tax: Price;
    withTax: Price;
    withoutTax: Price;
  };
  contracts: CartContract[];
};

export type AddOptionToCartResponse = {
  cartId: string;
  itemId: number;
  prices: {
    price: {
      value: number;
      currencyCode: string;
      priceInUcents: number;
      text: string;
    };
    label: string;
  }[];
  duration: string;
  settings: {
    cartId: string;
    pricingMode: string;
    subscription_id: number;
    planCode: string;
    quantity: number;
  };
  offerId: string | null;
  options: unknown[];
  productId: string;
};

export type TCheckoutResponse = {
  contracts: CartContract[];
  prices: {
    originalWithoutTax: Price;
    reduction: Price;
    tax: Price;
    withTax: Price;
    withoutTax: Price;
  };
  details: CartDetail[];
  orderId: number;
  url: string;
};
