export enum TOrderFollowUpStatus {
  DOING = 'DOING',
  DONE = 'DONE',
  ERROR = 'ERROR',
  TODO = 'TODO',
}

export enum TOrderFollowUpStep {
  AVAILABLE = 'AVAILABLE',
  DELIVERING = 'DELIVERING',
  VALIDATED = 'VALIDATED',
  VALIDATING = 'VALIDATING',
}

export enum TOrderFollowUpLabel {
  DELIVERY = 'DELIVERY',
  FRAUD_CHECK = 'FRAUD_CHECK',
  FRAUD_DOCS_REQUESTED = 'FRAUD_DOCS_REQUESTED',
  FRAUD_MANUAL_REVIEW = 'FRAUD_MANUAL_REVIEW',
  FRAUD_REFUSED = 'FRAUD_REFUSED',
  INVOICE_IN_PROGRESS = 'INVOICE_IN_PROGRESS',
  INVOICE_SENT = 'INVOICE_SENT',
  ORDER_ACCEPTED = 'ORDER_ACCEPTED',
  ORDER_STARTED = 'ORDER_STARTED',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  REGISTERED_PAYMENT_INITIATED = 'REGISTERED_PAYMENT_INITIATED',
}

export type TOrderFollowUp = {
  history: Array<{
    date: string;
    description: string;
    label: TOrderFollowUpLabel;
  }>;
  status: TOrderFollowUpStatus;
  step: TOrderFollowUpStep;
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
