import { PCI_FEATURES as FEATURES } from '../../../../projects.constant';

export const PAYMENT_METHOD_AUTHORIZED_ENUM = {
  BANK_ACCOUNT: 'bankAccount',
  CREDIT: 'credit',
  CREDIT_CARD: 'creditCard',
  PAYPAL: 'paypal',
  SEPA_DIRECT_DEBIT: 'sepaDirectDebit',
  RUPAY: 'rupay',
};

export const PREFERRED_PAYMENT_METHOD_ORDER = [
  PAYMENT_METHOD_AUTHORIZED_ENUM.CREDIT_CARD,
  PAYMENT_METHOD_AUTHORIZED_ENUM.PAYPAL,
  PAYMENT_METHOD_AUTHORIZED_ENUM.BANK_ACCOUNT,
  PAYMENT_METHOD_AUTHORIZED_ENUM.CREDIT,
  PAYMENT_METHOD_AUTHORIZED_ENUM.SEPA_DIRECT_DEBIT,
  PAYMENT_METHOD_AUTHORIZED_ENUM.RUPAY,
];

export const CREDIT_PROVISIONING = {
  PLAN_CODE: 'credit.default',
  PRICE_MODE: 'default',
};

export const PCI_FEATURES = FEATURES;

export default {
  PAYMENT_METHOD_AUTHORIZED_ENUM,
  PREFERRED_PAYMENT_METHOD_ORDER,
  CREDIT_PROVISIONING,
};
