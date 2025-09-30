export enum PaymentMethodStatus {
  PROCESSING = 'PROCESSING', // Waiting a backend return
  REGISTERED = 'REGISTERED', // Done, the PM is ready to rumble
  ERROR = 'ERROR', // Something when't wrong with the PM
  PENDING = 'PENDING', // Waiting something, generally a user action
  CHALLENGE_WAITING = 'CHALLENGE_WAITING', // Waiting for user action required by the PSP
  CHALLENGE_OK = 'CHALLENGE_OK', // When challenge required by the PSP is ok
  CHALLENGE_ERROR = 'CHALLENGE_ERROR', // When challenge required by the PSP and return an Error
  CHALLENGE_CANCELED = 'CHALLENGE_CANCELED', // When challenge required by the PSP is canceled by the user
  CHALLENGE_REFUSED = 'CHALLENGE_REFUSED', // When challenge required by the PSP and payment was refused
  PAYMENT_METHOD_SAVED = 'PAYMENT_METHOD_SAVED', // When a payment is a success
}

export enum ComponentStatus {
  PENDING = 'PENDING', // Waiting something, generally a user action
  LOADING = 'LOADING', // When loading external resource
  ERROR = 'ERROR', // Something when't wrong
  WAITING_USER_ACTION = 'WAITING_USER_ACTION', // Waiting a user action
  PROCESSING = 'PROCESSING', // Work in progress…
  READY_TO_GO_FORWARD = 'READY_TO_GO_FORWARD', // PM and PSP are ready, the UI can go forward or wait user action
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS', // When a payment is a success
  PAYMENT_METHOD_SAVED = 'PAYMENT_METHOD_SAVED', // When a payment method is registered or updated
}

export type TCreditData = {
  isCredit?: boolean;
  creditAmount?: { value: number; text: string; currencyCode: string };
};

export type GlobalStateStatus = {
  componentStatus: ComponentStatus;
  paymentMethodStatus: PaymentMethodStatus;
  error?: string | null;
  data?: TCreditData | unknown;
};

export type TWillPaymentConfig = {
  baseUrl: string;
  onChange: (param: GlobalStateStatus) => void;
  subsidiary?: string;
  language?: string;
  eventBus?: Element;
  hostApp?: 'manager' | 'pci';
  logging?: {
    environment?: string;
    userId?: string;
  };
};
