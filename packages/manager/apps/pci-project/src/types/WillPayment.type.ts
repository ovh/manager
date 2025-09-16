export type GlobalStateStatus = {
  componentStatus: GlobalStateComponentStatus;
  paymentMethodStatus: GlobalStatePaymentMethodStatus;
  error?: string | null;
  data?: unknown;
};

export type GlobalStatePaymentMethodStatus =
  | 'PROCESSING' // Waiting a backend return
  | 'REGISTERED' // Done, the PM is ready to rumble
  | 'ERROR' // Something when’t wrong with the PM
  | 'PENDING' // Waiting something, generally a user action
  | 'CHALLENGE_WAITING' // Waiting for user action required by the PSP
  | 'CHALLENGE_OK' // When challenge required by the PSP is ok
  | 'CHALLENGE_ERROR' // When challenge required by the PSP and return an Error
  | 'CHALLENGE_CANCELED' // When challenge required by the PSP is canceled by the user
  | 'CHALLENGE_REFUSED' // When challenge required by the PSP and payment was refused
  | 'PAYMENT_METHOD_SAVED'; // When a payment is a success

export type GlobalStateComponentStatus =
  | 'PENDING' // Waiting something, generally a user action
  | 'LOADING' // When loading external resource
  | 'ERROR' // Something when’t wrong
  | 'WAITING_USER_ACTION' // Waiting a user action
  | 'PROCESSING' // Work in progress…
  | 'READY_TO_GO_FORWARD' // PM and PSP are ready, the UI can go forward or wait user action
  | 'PAYMENT_SUCCESS' // When a payment is a success
  | 'PAYMENT_METHOD_SAVED'; // When a payment method is registered or updated

export type TWillPaymentConfig = {
  baseUrl: string;
  onChange: (param: GlobalStateStatus) => void;
  subsidiary?: string;
  language?: string;
  eventBus?: Element;
  hostApp?: 'manager' | 'pci';
  orderId?: never;
  logging?: {
    environment?: string;
    userId?: string;
  };
};
