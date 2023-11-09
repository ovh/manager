export const PAYPAL_BUTTON_OPTIONS = {
  env: 'production',
  commit: true,
  locale: 'fr_FR', // french by default
  style: {
    color: 'blue',
    label: 'paypal',
    shape: 'rect',
    tagline: false,
  },
};

export const PAYPAL_SCRIPT = {
  src:
    'https://www.paypal.com/sdk/js?client-id=test&components=buttons,funding-eligibility',
  id: 'paypal_checkout_script',
};

export default {
  PAYPAL_BUTTON_OPTIONS,
  PAYPAL_SCRIPT,
};
