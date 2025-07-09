import { CurrencyCode } from '@ovh-ux/manager-react-components';

export type TEligibility = {
  actionsRequired: EligibilityAction[];
  paymentMethodsAuthorized: PaymentMethod[];
  voucher: null | { credit: ProjectPrice; paymentMethodRequired: boolean };
  minimumCredit: ProjectPrice;
};

export enum EligibilityAction {
  ADD_PAYMENT_METHOD = 'addPaymentMethod',
  ASK_INCREASE_PROJECTS_QUOTA = 'askIncreaseProjectsQuota',
  CHALLENGE_PAYMENT_METHOD = 'challengePaymentMethod',
  VERIFY_PAYPAL = 'verifyPaypal',
}

export enum PaymentMethod {
  BANK_ACCOUNT = 'bankAccount',
  CREDIT = 'credit',
  CREDIT_CART = 'creditCard',
  PAYPAL = 'paypal',
  RUPAY = 'rupay',
  SEPA_DIRECT_DEBIT = 'sepaDirectDebit',
}

export type ProjectPrice = {
  text: string;
  value: number;
  currencyCode: CurrencyCode;
  priceInUcents?: number | null;
};
