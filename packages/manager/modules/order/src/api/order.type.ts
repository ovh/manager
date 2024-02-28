export type Cart = {
  cartId: string;
  description: string;
  // Date yyyy-mm-ddTZ
  expire?: string;
  items: number[];
  readOnly: boolean;
};

export type Creation = {
  description?: string;
  // Date yyyy-mm-ddTZ
  expire?: string;
  ovhSubsidiary: string;
};

export type Price = {
  currencyCode:
    | 'AUD'
    | 'CAD'
    | 'CZK'
    | 'EUR'
    | 'GBP'
    | 'INR'
    | 'LTL'
    | 'MAD'
    | 'N/A'
    | 'PLN'
    | 'SGD'
    | 'TND'
    | 'USD'
    | 'XOF'
    | 'points';
  text: string;
  priceInUcents?: number;
  value: number;
};

export type Item<T = unknown> = {
  cartId: string;
  configurations: number[];
  duration: string | null;
  itemId: number;
  offerId: string;
  options: number[];
  parentItemId?: number | null;
  prices: {
    label: 'DISCOUNT' | 'FEE' | 'PRICE' | 'RENEW' | 'TOTAL';
    price: Price;
  }[];
  productId: string;
  settings: T;
};

export type Order = {
  contracts: {
    content: string;
    name: string;
    url: string;
  }[];
  details: {
    cartItemID: number | null;
    description: string;
    detailType:
      | 'ACCESSORY'
      | 'CAUTION'
      | 'CHOOSED'
      | 'CONSUMPTION'
      | 'CREATION'
      | 'DELIVERY'
      | 'DURATION'
      | 'GIFT'
      | 'INSTALLATION'
      | 'LICENSE'
      | 'MUTE'
      | 'OTHER'
      | 'OUTPLAN'
      | 'QUANTITY'
      | 'REFUND'
      | 'RENEW'
      | 'SPECIAL'
      | 'SWITCH'
      | 'TRANSFER'
      | 'VOUCHER';
    domain: string;
    originalTotalPrice: Price;
    quantity: number;
    reductionTotalPrice: Price;
    reductions: [
      {
        context: 'promotion' | 'voucher';
        description: string;
        price: Price;
        reductionDescription: string;
        type: 'fixed_amount' | 'forced_amount' | 'percentage';
        value: Price;
      },
    ];
    totalPrice: Price;
    unitPrice: Price;
  }[];
  orderId: number;
  prices: {
    originalWithoutTax: Price;
    reduction: Price;
    tax: Price;
    withTax: Price;
    withoutTax: Price;
  };
  url: string;
};

export type OrderData = {
  expirationDate?: string | null;
  retractionDate?: string | null;
  priceWithoutTax: Price;
  date: string;
  password: string;
  orderId: number;
  tax: Price;
  pdfUrl: string;
  url: string;
  priceWithTax: Price;
};

export type OrderStatus =
  | 'cancelled'
  | 'cancelling'
  | 'checking'
  | 'delivered'
  | 'delivering'
  | 'documentsRequested'
  | 'notPaid'
  | 'unknown';

export type OrderDetail = {
  cancelled: boolean;
  description: string;
  detailType:
    | 'ACCESSORY'
    | 'CAUTION'
    | 'CHOOSED'
    | 'CONSUMPTION'
    | 'CREATION'
    | 'DELIVERY'
    | 'DURATION'
    | 'GIFT'
    | 'INSTALLATION'
    | 'LICENSE'
    | 'MUTE'
    | 'OTHER'
    | 'OUTPLAN'
    | 'QUANTITY'
    | 'REFUND'
    | 'RENEW'
    | 'SPECIAL'
    | 'SWITCH'
    | 'TRANSFER'
    | 'VOUCHER';
  domain?: string;
  orderDetailId: number;
  quantity: string;
  totalPrice: Price;
  unitPrice: Price;
};

export type ConfigurationItem = {
  description: string;
  // Configuration ID
  id: string;
  label: string;
  value: string;
};
