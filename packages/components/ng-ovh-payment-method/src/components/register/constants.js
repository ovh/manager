import CREDIT_CARD from './assets/credit_card.png';
import PAYPAL from './assets/paypal.png';
import BANK_ACCOUNT from './assets/bank_account.png';

export const DEFAULT_DISPLAY_PER_LINE = 3;

export const DEFAULT_ORDERED_PAYMENT_METHOD_TYPES = [
  'CREDIT_CARD',
  'PAYPAL',
  'BANK_ACCOUNT',
];

export const DEFAULT_SELECTED_PAYMENT_METHOD_TYPE = 'CREDIT_CARD';

export const FALLBACK_IMAGES = {
  CREDIT_CARD,
  PAYPAL,
  BANK_ACCOUNT,
};

export const PAYPAL_PAYMENT_METHOD = 'PAYPAL';

export default {
  DEFAULT_DISPLAY_PER_LINE,
  DEFAULT_ORDERED_PAYMENT_METHOD_TYPES,
  DEFAULT_SELECTED_PAYMENT_METHOD_TYPE,
  FALLBACK_IMAGES,
};
