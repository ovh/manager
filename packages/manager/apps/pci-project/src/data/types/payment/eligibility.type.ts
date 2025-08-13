import { CurrencyCode } from '@ovh-ux/manager-react-components';

export enum TEligibilityRequiredAction {
  ADD_PAYMENT_METHOD = 'addPaymentMethod',
  ASK_INCREASE_PROJECTS_QUOTA = 'askIncreaseProjectsQuota',
  CHALLENGE_PAYMENT_METHOD = 'challengePaymentMethod',
  VERIFY_PAYPAL = 'verifyPaypal',
}

export enum TEligibilityPaymentMethod {
  BANK_ACCOUNT = 'bankAccount',
  CREDIT = 'credit',
  CREDIT_CARD = 'creditCard',
  PAYPAL = 'paypal',
  RUPAY = 'rupay',
  SEPA_DIRECT_DEBIT = 'sepaDirectDebit',
}

export type ProjectPrice = {
  currencyCode: CurrencyCode;
  priceInUcents?: number | null | undefined;
  text: string;
  value: number;
};

export type TEligibilityVoucher = {
  credit: ProjectPrice;
  paymentMethodRequired: boolean;
};

export type TEligibility = {
  actionsRequired: TEligibilityRequiredAction[];
  minimumCredit: ProjectPrice | null;
  paymentMethodsAuthorized: TEligibilityPaymentMethod[];
  voucher: TEligibilityVoucher | null;
};
