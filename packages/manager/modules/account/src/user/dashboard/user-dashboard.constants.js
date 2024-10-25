export const USER_DASHBOARD_SHORTCUTS = [
  {
    key: 'ALL_BILLS',
    state: 'account.billing.main.history',
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'PAYMENT_FOLLOW_UP',
    state: 'account.billing.main.payments',
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    state: 'account.billing.payment.method.add',
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'MANAGE_SERVICES',
    state: 'account.billing.autorenew',
    regions: ['EU', 'CA'],
  },
  {
    key: 'MANAGE_USERS',
    url: {
      baseURL: 'iam',
      path: '/dashboard/users',
    },
    new: true,
  },
  {
    key: 'ADD_CONTACT',
    state: 'account.contacts.services',
    regions: ['EU'],
  },
];

export default {
  USER_DASHBOARD_SHORTCUTS,
};
