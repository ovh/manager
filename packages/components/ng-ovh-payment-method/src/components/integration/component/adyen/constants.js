export const ADYEN_CONFIG = {
  CLIENT_KEY_ENV_PATTERNS: /^(test)_/,
  ENV_ENUM: {
    TEST: 'test',
    LIVE: 'live',
  },
  DEFAULT: {
    showPayButton: false,
    hasHolderName: true,
    holderNameRequired: true,
    paymentMethodsResponse: {
      paymentMethods: [
        {
          brands: ['cartebancaire', 'mc', 'visa'],
          details: [
            {
              key: 'encryptedCardNumber',
              type: 'cardToken',
            },
            {
              key: 'encryptedSecurityCode',
              type: 'cardToken',
            },
            {
              key: 'encryptedExpiryMonth',
              type: 'cardToken',
            },
            {
              key: 'encryptedExpiryYear',
              type: 'cardToken',
            },
            {
              key: 'holderName',
              optional: true,
              type: 'text',
            },
          ],
          name: 'Credit Card',
          type: 'scheme',
        },
      ],
    },
    styles: {
      base: {
        color: '#4d5592',
        lineHeight: '1.25rem',
        fontFamily: '"Source Sans Pro"',
        fontSize: '1rem',
        fontSmoothing: 'antialiased',
        fontWeight: '400',
      },
      placeholder: {
        color: '#4d5592',
      },
    },
  },
};

export const ADYEN_RESULT_CODE = {
  AUTHORIZED: 'Authorised',
  ERROR: 'Error',
  PENDING: 'Pending',
  REFUSED: 'Refused',
};

export default {
  ADYEN_CONFIG,
  ADYEN_RESULT_CODE,
};
