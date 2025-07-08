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
