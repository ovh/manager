import {
  TAvailablePaymentMethod,
  TPaymentMethodIntegration,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import CREDIT_CARD_ICON from '@/assets/credit_card.png';
import PAYPAL_ICON from '@/assets/paypal.png';
import BANK_ACCOUNT_ICON from '@/assets/bank_account.png';
import SEPA_DIRECT_DEBIT_ICON from '@/assets/sepa_direct_debit.png';

export const CREDIT_PAYMENT_METHOD: TAvailablePaymentMethod = {
  icon: {
    data: undefined,
    name: 'credit',
    url: undefined,
    componentIcon: 'plus',
  },
  integration: TPaymentMethodIntegration.NONE,
  oneshot: true,
  paymentType: TPaymentMethodType.CREDIT,
  registerable: false,
  registerableWithTransaction: false,
  readableName: {
    key: 'pci_project_new_payment_method_add_credit',
    ns: 'payment/add',
  },
};

export const PREFERRED_PAYMENT_METHOD_ORDER = [
  TPaymentMethodType.CREDIT_CARD,
  TPaymentMethodType.PAYPAL,
  TPaymentMethodType.BANK_ACCOUNT,
  TPaymentMethodType.CREDIT,
  TPaymentMethodType.SEPA_DIRECT_DEBIT,
  TPaymentMethodType.RUPAY,
];

export enum TPaymentFeatureAvailability {
  ADYEN_LIVE_IN = 'payments:adyen-live-in',
  CREDIT_CARD_CROSS_BORDER = 'payments-cross-border',
  RUPAY_CHARGE = 'payments:rupay-message',
  SEPA_INFO_MSG = 'payments:sepa-information-message',
  PAYPAL_CHARGE = 'public-cloud:paypal-charge',
  SEPA_DIRECT_DEBIT = 'public-cloud:project:sepa-direct-debit',
}

export const FALLBACK_ICONS = {
  CREDIT_CARD: CREDIT_CARD_ICON,
  PAYPAL: PAYPAL_ICON,
  BANK_ACCOUNT: BANK_ACCOUNT_ICON,
  SEPA_DIRECT_DEBIT: SEPA_DIRECT_DEBIT_ICON,
};

export const CREDIT_PROVISIONING = {
  PLAN_CODE: 'credit.default',
  PRICE_MODE: 'default',
};

export const CONFIRM_CREDIT_CARD_TEST_AMOUNT = 2;
export const LANGUAGE_OVERRIDE = { IN: `en-IN`, ASIA: `en-GB` };
