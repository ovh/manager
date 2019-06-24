export const PAYPAL_LOGIN_URL = 'https://www.paypal.com/signin/authorize?flowEntry=static&client_id={clientId}&response_type=code&scope={scope}&redirect_uri={redirectUrl}';

export const PAYPAL_LOGIN_PARAMS = {
  clientId: {
    EU: 'ARDjg_zwSvyEKJD2kOJNP60M3IdZ7hkezGAZDp_2Le94pKpb6zyybwvptoCPjP0_kS_BfXG8BUVDDU2b',
    CA: 'ARDjg_zwSvyEKJD2kOJNP60M3IdZ7hkezGAZDp_2Le94pKpb6zyybwvptoCPjP0_kS_BfXG8BUVDDU2b',
    US: '',
  },
  redirectUrl: {
    EU: 'https://www.ovh.com/manager/public-cloud/#/pci/projects/new/payment/challenge/paypal',
    CA: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new/payment/challenge/paypal',
    US: 'https://us.ovhcloud.com/manager/public-cloud/#/pci/projects/new/payment/challenge/paypal',
  },
  scope: 'openid profile email https://uri.paypal.com/services/paypalattributes',
};

export const BUILD_PAYPAL_URL = (urlTemplate, params, region = 'EU') => {
  let url = urlTemplate;
  url = url.replace('{clientId}', params.clientId[region]);
  url = url.replace('{scope}', encodeURIComponent(params.scope));
  url = url.replace('{redirectUrl}', encodeURIComponent(params.redirectUrl[region]));

  return url;
};

export const PAYMENT_TYPE_PAYPAL = 'PAYPAL';
export const PAYMENT_TYPE_CREDIT_CARD = 'CREDIT_CARD';
export const PAYMENT_TYPE_BANK_ACCOUNT = 'BANK_ACCOUNT';

export const SESSION_DESCRIPTION_KEY = 'pci.projets.new.description';

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
  SESSION_DESCRIPTION_KEY,
};
