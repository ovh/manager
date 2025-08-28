import { TCart } from './cart.type';

export enum TPaymentMethodIntegration {
  BANK_TRANSFER = 'BANK_TRANSFER',
  COMPONENT = 'COMPONENT',
  IFRAME_VANTIV = 'IFRAME_VANTIV',
  IN_CONTEXT = 'IN_CONTEXT',
  NONE = 'NONE',
  POST_FORM = 'POST_FORM',
  REDIRECT = 'REDIRECT',
}

export enum TPaymentSubType {
  THIRTY_DAYS = '30_DAYS',
  FORTY_FIVE_DAYS = '45_DAYS',
  SIXTY_DAYS = '60_DAYS',
  AMERICAN_EXPRESS = 'AMERICAN_EXPRESS',
  AURA = 'AURA',
  CARTE_BANCAIRE = 'CARTE_BANCAIRE',
  CARTE_BLEUE = 'CARTE_BLEUE',
  CHORUS = 'CHORUS',
  DINERS_CLUB = 'DINERS_CLUB',
  DISCOVER = 'DISCOVER',
  JCB = 'JCB',
  MAESTRO = 'MAESTRO',
  MASTERCARD = 'MASTERCARD',
  NONE = 'NONE',
  RUPAY = 'RUPAY',
  VISA = 'VISA',
}

export enum TPaymentMethodStatus {
  CANCELED = 'CANCELED',
  CANCELING = 'CANCELING',
  CREATED = 'CREATED',
  CREATING = 'CREATING',
  ERROR = 'ERROR',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
  MAINTENANCE = 'MAINTENANCE',
  PAUSED = 'PAUSED',
  REJECTED = 'REJECTED',
  REPLACED = 'REPLACED',
  VALID = 'VALID',
  VALIDATING = 'VALIDATING',
}

export enum TPaymentMethodType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  CREDIT = 'CREDIT',
  CREDIT_CARD = 'CREDIT_CARD',
  DEFERRED_PAYMENT_ACCOUNT = 'DEFERRED_PAYMENT_ACCOUNT',
  PAYPAL = 'PAYPAL',
  SEPA_DIRECT_DEBIT = 'SEPA_DIRECT_DEBIT',
  RUPAY = 'RUPAY',
}

export type TPaymentMethodIcon = {
  data?: string;
  name: string;
  url?: string;
  componentIcon?: string;
};

export type TPaymentMethod = {
  icon: TPaymentMethodIcon;
  integration: TPaymentMethodIntegration;
  paymentSubType?: TPaymentSubType | null;
  paymentType: TPaymentMethodType;
  paymentMethodId: number;
};

export type TUserPaymentMethod = TPaymentMethod & {
  billingContactId: number | null;
  creationDate: string;
  default: boolean;
  description: string | null;
  expirationDate: string | null;
  formSessionId: string | null;
  integration: TPaymentMethodIntegration | null;
  label: string | null;
  lastUpdate: string;
  merchantId: string | null;
  oneclick: boolean | null;
  paymentMeanId: number | null;
  status: TPaymentMethodStatus;
};

export type TRegisterPaymentMethod = {
  formSessionId: string;
  merchantId: string;
  organizationId: string;
  paymentMethodId: number;
  transactionId: number;
  url: string;
  validationType: string;
};

export type TAvailablePaymentMethod = TPaymentMethod & {
  formSessionId?: string;
  merchantId?: string;
  oneshot: boolean;
  organizationId?: string;
  registerable: boolean;
  registerableWithTransaction: boolean;
  readableName?: { key: string; ns: string };
};

export type TPaymentCallbackReturnType = {
  continueProcessing: boolean;
  dataToReturn?: unknown;
};

export type TPaymentCallbackRegisterReturnType = {
  paymentMethod?: TRegisterPaymentMethod;
} & TPaymentCallbackReturnType;

export type TPaymentMethodIntegrationRef = {
  registerPaymentMethod?: (
    paymentMethod: TPaymentMethod,
    cart: TCart,
    registerPaymentMethod?: TRegisterPaymentMethod,
  ) => Promise<TPaymentCallbackRegisterReturnType>;
  checkPaymentMethod?: (
    cart: TCart,
    paymentMethodId?: number,
  ) => Promise<TPaymentCallbackReturnType>;
  onCheckoutRetrieved?: (
    cart: TCart,
    paymentMethodId?: number,
  ) => Promise<TPaymentCallbackReturnType>;
  onCartFinalized?: (
    cart: TCart,
    paymentMethodId?: number,
  ) => Promise<TPaymentCallbackReturnType>;
};

export type TPaymentMethodRegisterRef = {
  registerPaymentMethod?: (
    paymentMethod: TPaymentMethod,
    cart: TCart,
  ) => Promise<TPaymentCallbackRegisterReturnType>;
  checkPaymentMethod?: (
    cart: TCart,
    paymentMethodId?: number,
  ) => Promise<TPaymentCallbackReturnType>;
  onCheckoutRetrieved?: (
    cart: TCart,
    paymentMethodId?: number,
  ) => Promise<TPaymentCallbackReturnType>;
  onCartFinalized?: (
    cart: TCart,
    paymentMethodId?: number,
  ) => Promise<TPaymentCallbackReturnType>;
};
