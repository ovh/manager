import { TProjectPrice } from './project.type';

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

export type TEligibilityVoucher = {
  credit: TProjectPrice;
  paymentMethodRequired: boolean;
};

export type TEligibility = {
  actionsRequired: TEligibilityRequiredAction[];
  minimumCredit: TProjectPrice | null;
  paymentMethodsAuthorized: TEligibilityPaymentMethod[];
  voucher: TEligibilityVoucher | null;
};
