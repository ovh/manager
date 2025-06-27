export type TEligibiilityRequiredAction =
  | 'addPaymentMethod'
  | 'askIncreaseProjectsQuota'
  | 'challengePaymentMethod'
  | 'verifyPaypal';

export type TEligibilityCurrencyCode =
  | 'AUD'
  | 'CAD'
  | 'CZK'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'LTL'
  | 'MAD'
  | 'N/A'
  | 'PLN'
  | 'SGD'
  | 'TND'
  | 'USD'
  | 'XOF'
  | 'points';

export type TEligibilityCredit = {
  currencyCode: TEligibilityCurrencyCode;
  priceInUcents: number | null;
  text: string;
  value: number;
};

export type TEligibilityPaymentMethod =
  | 'bankAccount'
  | 'credit'
  | 'creditCard'
  | 'paypal'
  | 'rupay'
  | 'sepaDirectDebit';

export type TEligibilityVoucher = {
  credit: TEligibilityCredit;
  paymentMethodRequired: boolean;
};

export type TEligibility = {
  actionsRequired: TEligibiilityRequiredAction[];
  minimumCredit: TEligibilityCredit | null;
  paymentMethodsAuthorized: TEligibilityPaymentMethod[];
  voucher: TEligibilityVoucher | null;
};
