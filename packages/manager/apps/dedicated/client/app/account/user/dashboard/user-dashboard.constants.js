export const USER_DASHBOARD_SHORTCUTS = [
  {
    key: 'ALL_BILLS',
    state: 'app.account.billing.main.history',
  },
  {
    key: 'PAYMENT_FOLLOW_UP',
    state: 'app.account.billing.payment.transactions',
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    state: 'app.account.billing.payment.method.add',
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
