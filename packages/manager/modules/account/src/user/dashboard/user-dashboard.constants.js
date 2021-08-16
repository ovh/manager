import { buildURL } from '@ovh-ux/ufrontend';

export const USER_DASHBOARD_SHORTCUTS = [
  {
    key: 'ALL_BILLS',
    href: buildURL('dedicated', '#/billing'),
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'PAYMENT_FOLLOW_UP',
    href: buildURL('dedicated', '#/billing/payments'),
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    href: buildURL('dedicated', '#/billing/payment/method/add'),
    isAvailable: (user) => !user.enterprise,
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
  },
  {
    key: 'MANAGE_SERVICES',
    href: buildURL('dedicated', '#/billing/autorenew'),
    regions: ['EU', 'CA'],
  },
  {
    key: 'ADD_CONTACT',
    href: buildURL('dedicated', '#/contacts/services'),
    regions: ['EU'],
  },
];

export default {
  USER_DASHBOARD_SHORTCUTS,
};
