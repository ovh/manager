export const ADYEN_CONFIG = {
  DEFAULT: {
    environment: 'live',
    showPayButton: false,
    hasHolderName: true,
    holderNameRequired: true,
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
