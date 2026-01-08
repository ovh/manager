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
  metadata?: ServiceMetadata | null;
  planCode: string;
  planFamily: string;
  price: Price;
  uniqueId: string | null;
};
