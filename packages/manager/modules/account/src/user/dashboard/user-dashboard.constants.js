export const USER_DASHBOARD_SHORTCUTS = [
  {
    key: 'ALL_BILLS',
    state: 'app.account.billing.main.history',
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'PAYMENT_FOLLOW_UP',
    state: 'app.account.billing.main.payments',
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    state: 'app.account.billing.payment.method.add',
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'MANAGE_SERVICES',
    state: 'app.account.billing.autorenew',
    regions: ['EU', 'CA'],
  },
  {
    key: 'ADD_CONTACT',
    state: 'app.account.contacts.services',
    regions: ['EU'],
  },
];

export default {
  USER_DASHBOARD_SHORTCUTS,
};
