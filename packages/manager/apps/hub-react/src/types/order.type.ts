type Price = {
  currencyCode: string;
  text: string;
  value: number;
};

export type LastOrder = {
  date: string;
  expirationDate: string;
  orderId: number;
  password: string;
  pdfUrl: string;
  priceWithTax: Price;
  priceWithoutTax: Price;
  retractionDate: string | null;
  tax: Price;
  url: string;
};

export type OrderResponseData = {
  data: LastOrder;
  status: string;
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
  domain: string;
  quantity: string;
  cancelled: boolean;
  unitPrice: Price;
  detailType: string;
  totalPrice: Price;
  description: string;
  orderDetailId: number;
};

export type OrderDetailsResponse = OrderDetail[];

export type HistoryEntry = {
  date: string;
  label: string;
  description: string;
};

export type FollowUpStep = {
  history: HistoryEntry[];
  status: string;
  step: string;
};

export type OrderFollowUpResponse = FollowUpStep[];

export type LastOrderTrackingResponse = LastOrder & {
  history: OrderHistory[];
  status: string;
};

export type OrderHistory = {
  date: string;
  label: string;
};
