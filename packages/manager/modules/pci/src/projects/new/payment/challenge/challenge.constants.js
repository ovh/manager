export const PAYPAL_LOGIN_URL =
  'https://www.paypal.com/signin/authorize?flowEntry=static&client_id={clientId}&scope={scope}&redirect_url={redirectUrl}';

export const PAYPAL_LOGIN_PARAMS = {
  clientId: '',
  redirectUrl: '',
  scope:
    'openid profile email https://uri.paypal.com/services/paypalattributes',
};

export const BUILD_PAYPAL_URL = (urlTemplate, params) => {
  let url = urlTemplate;
  url = url.replace('{clientId}', params.clientId);
  url = url.replace('{scope}', params.scope);
  url = url.replace('{redirectUrl}', encodeURIComponent(params.redirectUrl));

  return url;
};

export const PAYMENT_TYPE_PAYPAL = 'PAYPAL';
export const PAYMENT_TYPE_CREDIT_CARD = 'CREDIT_CARD';
export const PAYMENT_TYPE_BANK_ACCOUNT = 'BANK_ACCOUNT';

export const CHALLENGE_PAYMENT_TYPE_SUPPORTED = [
  PAYMENT_TYPE_PAYPAL,
  PAYMENT_TYPE_CREDIT_CARD,
  PAYMENT_TYPE_BANK_ACCOUNT,
];

export default {
  CHALLENGE_PAYMENT_TYPE_SUPPORTED,
  PAYMENT_TYPE_PAYPAL,
  PAYMENT_TYPE_CREDIT_CARD,
  PAYMENT_TYPE_BANK_ACCOUNT,
  PAYPAL_LOGIN_URL,
  PAYPAL_LOGIN_PARAMS,
  BUILD_PAYPAL_URL,
};
