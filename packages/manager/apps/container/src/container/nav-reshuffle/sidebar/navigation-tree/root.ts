import services from './services';

export default {
  children: [
    {
      id: 'home',
      translation: 'sidebar_home',
      routing: {
        application: 'hub',
      },
      count: false,
    },
    services,
    {
      id: 'account',
      translation: 'sidebar_account',
      routing: {
        application: 'dedicated',
        hash: '#/useraccount',
      },
      count: false,
    },
    {
      id: 'billing',
      translation: 'sidebar_billing',
      routing: {
        application: 'dedicated',
        hash: '#/billing/history',
      },
      count: false,
    },
    {
      id: 'orders',
      translation: 'sidebar_orders',
      routing: {
        application: 'dedicated',
        hash: '#/billing/orders',
      },
      count: false,
    },
    {
      id: 'sunrise',
      translation: 'sidebar_sunrise',
      routing: {
        application: 'sunrise',
      },
      count: false,
      region: ['EU', 'CA'],
    },
    {
      id: 'marketplace',
      translation: 'sidebar_marketplace',
      url: 'https://marketplace.ovhcloud.com/',
      isExternal: true,
      count: false,
      region: ['EU'],
    },
  ],
};
