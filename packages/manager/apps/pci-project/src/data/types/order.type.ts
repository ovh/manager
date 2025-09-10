export type TOrderFollowUpStatus = 'DOING' | 'DONE' | 'ERROR' | 'TODO';
export type TOrderFollowUpStep =
  | 'AVAILABLE'
  | 'DELIVERING'
  | 'VALIDATED'
  | 'VALIDATING';

export type TOrderFollowUpHistory = {
  date: string;
  description: string;
  label:
    | 'DELIVERY'
    | 'FRAUD_CHECK'
    | 'FRAUD_DOCS_REQUESTED'
    | 'FRAUD_MANUAL_REVIEW'
    | 'FRAUD_REFUSED'
    | 'INVOICE_IN_PROGRESS'
    | 'INVOICE_SENT'
    | 'ORDER_ACCEPTED'
    | 'ORDER_STARTED'
    | 'PAYMENT_CONFIRMED'
    | 'PAYMENT_INITIATED'
    | 'PAYMENT_RECEIVED'
    | 'REGISTERED_PAYMENT_INITIATED';
};

export type TOrderFollowUp = {
  step: TOrderFollowUpStep;
  status: TOrderFollowUpStatus;
  history: TOrderFollowUpHistory[];
};

export type TOrderDetailExtension = {
  order: {
    action: string;
    configuration: {
      label: string;
      value: string;
    }[];
    plan: {
      code: string;
    };
    type: 'plan' | 'product' | null;
  };
};

type TOrderPrice = {
  currencyCode: string;
  priceInUcents: number;
  text: string;
  value: number;
};

export type TOrderDetail = {
  cancelled: boolean;
  description: string;
  detailType: string;
  domain: string;
  orderDetailId: number;
  quantity: string;
  totalPrice: TOrderPrice;
  unitPrice: TOrderPrice;
};
