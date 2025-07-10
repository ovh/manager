export interface PayPalButtonConfig {
  commit: boolean;
  locale: string;
  style: {
    color: string;
    label: string;
    shape: string;
    size: string;
    tagline: boolean;
  };
}

export interface PayPalPaymentConfig {
  payment: () => Promise<string>;
  onAuthorize: (data: PayPalAuthorizationData) => Promise<void>;
  onError: (error: Error) => void;
  onCancel?: (data: PayPalCancelData) => void;
}

export interface PayPalAuthorizationData {
  paymentID: number;
  payerID: string;
  billingToken: string;
  returnUrl: string;
}

export interface PayPalCancelData {
  paymentID: string;
}

export interface PayPalSDK {
  Button: {
    render: (
      config: PayPalButtonConfig & PayPalPaymentConfig,
      container: HTMLElement,
    ) => void;
  };
}

export interface PaymentData {
  paymentMethodId: number;
  formSessionId: string;
}
