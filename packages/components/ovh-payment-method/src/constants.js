import { PAYMENT_MEAN_TYPE_ENUM } from './enums/payment-mean.enum';

export const AVAILABLE_PAYMENT_MEAN_TYPES = {
  EU: [
    {
      value: PAYMENT_MEAN_TYPE_ENUM.BANK_ACCOUNT,
      registerable: true,
    },
    {
      value: PAYMENT_MEAN_TYPE_ENUM.PAYPAL,
      registerable: true,
    },
    {
      value: PAYMENT_MEAN_TYPE_ENUM.CREDIT_CARD,
      registerable: true,
    },
    {
      value: PAYMENT_MEAN_TYPE_ENUM.DEFERRED_PAYMENT_ACCOUNT,
      registerable: false,
    },
  ],
  CA: [
    {
      value: PAYMENT_MEAN_TYPE_ENUM.PAYPAL,
      registerable: true,
    },
    {
      value: PAYMENT_MEAN_TYPE_ENUM.CREDIT_CARD,
      registerable: true,
    },
    {
      value: PAYMENT_MEAN_TYPE_ENUM.DEFERRED_PAYMENT_ACCOUNT,
      registerable: false,
    },
  ],
};

export const DEFAULT_GET_OPTIONS = {
  onlyValid: false,
  transform: true, // transform legacy payment methods to payment methods
};

export const DEFAULT_GET_AVAILABLE_OPTIONS = {
  onlyRegisterable: true,
  transform: true, // transform legacy payment method types to payment method types
};

export default {
  AVAILABLE_PAYMENT_MEAN_TYPES,
  DEFAULT_GET_AVAILABLE_OPTIONS,
  DEFAULT_GET_OPTIONS,
};
