import { ApiEnvelope } from '@/types/apiEnvelope.type';

type Price = {
  currencyCode: string;
  text: string;
  value: number;
};

export type Order = {
  date: string;
  expirationDate: string;
  orderId: number;
  password: string;
  pdfUrl: string;
  priceWithTax: Price;
  priceWithoutTax: Price;
  retractionDate: string;
  tax: Price;
  url: string;
};

export type LastOrder = ApiEnvelope<Order>;

type LastOrderData = {
  lastOrder: LastOrder;
};

export type LastOrderEnvelope = ApiEnvelope<LastOrderData>;
