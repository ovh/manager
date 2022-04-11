import services from './services';

export default {
  children: [
    {
      id: 'home',
      translation: 'sidebar_home',
      path: '/manager',
    },
    services,
    {
      id: 'account',
      translation: 'sidebar_account',
    },
    {
      id: 'billing',
      translation: 'sidebar_billing',
    },
    {
      id: 'orders',
      translation: 'sidebar_orders',
    },
    {
      id: 'sunrise',
      translation: 'sidebar_sunrise',
    },
    {
      id: 'marketplace',
      translation: 'sidebar_marketplace',
    },
  ],
};
