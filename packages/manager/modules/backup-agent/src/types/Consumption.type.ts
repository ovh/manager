export type CurrencyCode =
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

export type Price = {
  currencyCode: CurrencyCode;
  priceInUcents: number | null;
  text: string;
  value: number;
};

export type ServiceMetadata = {
  key: string;
  value?: string;
};

export type ServiceConsumption = {
  beginDate: string | null;
  endDate: string | null;
  pricingMode: string;
  quantity: number;
  metadata?: ServiceMetadata;
  planCode: string;
  planFamily: string;
  price: Price;
  uniqueId: string | null;
};
