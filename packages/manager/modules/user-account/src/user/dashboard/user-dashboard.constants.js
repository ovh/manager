export const USER_DASHBOARD_SHORTCUTS = [
  {
    key: 'ALL_BILLS',
    state: 'account.billing.main.history',
    isAvailable: (user) => !user.isEnterprise,
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.isEnterprise,
  },
  {
    key: 'PAYMENT_FOLLOW_UP',
    state: 'account.billing.payment.transactions',
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    state: 'account.billing.payment.method.add',
  },
  {
    key: 'MANAGE_SERVICES',
    state: 'account.billing.autorenew',
    regions: ['EU', 'CA'],
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
