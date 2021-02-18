const APIS = [
  {
    serviceType: 'apiv6',
    urlPrefix: '/engine/apiv6',
  },
  {
    serviceType: 'aapi',
    urlPrefix: '/engine/2api',
  },
  {
    serviceType: 'apiv7',
    urlPrefix: '/engine/apiv7',
  },
];

const LOGIN_URLS = {
  EU: 'https://www.ovh.com/auth',
  CA: 'https://ca.ovh.com/auth',
  US: 'https://us.ovhcloud.com/auth',
};

export const DEV_CONFIG = {
  apis: APIS,
  loginUrl: '/auth',
  userUrl: '/engine/apiv6/me',
};

export const PROD_CONFIG = {
  apis: APIS,
};

const getProdConfig = (region) => {
  return {
    ...PROD_CONFIG,
    loginUrl: LOGIN_URLS[region],
  };
};

export default (region, production = true) => {
  return production ? getProdConfig(region) : DEV_CONFIG;
};
