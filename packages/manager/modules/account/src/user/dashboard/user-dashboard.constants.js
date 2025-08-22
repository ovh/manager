export const USER_DASHBOARD_SHORTCUTS = [
  {
    key: 'ALL_BILLS',
    url: {
      baseURL: 'dedicated',
      path: '#/billing/history',
    },
    isAvailable: (user) => !user.enterprise,
    tracking_name_suffix: 'my-bills',
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
    isExternal: true,
    tracking_name_suffix: 'my-bills',
  },
  {
    key: 'PAYMENT_FOLLOW_UP',
    url: {
      baseURL: 'dedicated',
      path: '#/billing/payments',
    },
    isAvailable: (user) => !user.enterprise,
    tracking_name_suffix: 'track-payments',
  },
  {
    key: 'ALL_BILLS',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
    isExternal: true,
    tracking_name_suffix: 'my-bills',
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    url: {
      baseURL: 'dedicated',
      path: '#/billing/payment/method/add',
    },
    isAvailable: (user) => !user.enterprise,
    tracking_name_suffix: 'add-payment-method',
  },
  {
    key: 'ADD_PAYMENT_METHOD',
    href: 'https://billing.us.ovhcloud.com/login',
    isAvailable: (user) => user.enterprise,
    isExternal: true,
    tracking_name_suffix: 'add-payment-method',
  },
  {
    key: 'ALL_AGREEMENTS',
    url: {
      baseURL: 'billing',
      path: '#/autorenew/agreements',
    },
    regions: ['EU', 'CA'],
    tracking_name_suffix: 'my-contracts',
  },
  {
    key: 'MANAGE_SERVICES',
    url: {
      baseURL: 'dedicated',
      path: '#/billing/autorenew',
    },
    regions: ['EU', 'CA'],
    tracking_name_suffix: 'manage-my-services',
  },
  {
    key: 'MANAGE_USERS',
    url: {
      baseURL: 'iam',
      path: '/dashboard/users',
    },
    tracking_name_suffix: 'manage-my-users',
  },
  {
    key: 'ADD_CONTACT',
    state: 'account.contacts.services',
    regions: ['EU'],
    tracking_name_suffix: 'add-contact',
  },
];

const TRACKING_CHAPTER_1 = 'Hub';
const TRACKING_CHAPTER_2 = 'account';
const TRACKING_CHAPTER_3 = 'user';

const TRACKING_PAGE_SUFFIX = 'user::dashboard::general-informations';
export const TRACKING_PAGE_CATEGORY = 'dashboard';
export const TRACKING_PAGE = `${TRACKING_CHAPTER_1}::${TRACKING_CHAPTER_2}::${TRACKING_CHAPTER_3}::${TRACKING_PAGE_SUFFIX}`;
export const TRACKING_SHORTCUT_ACTION_PREFIX_NAME = `${TRACKING_CHAPTER_1}::${TRACKING_CHAPTER_2}::${TRACKING_CHAPTER_3}::page::link`;

export default {
  USER_DASHBOARD_SHORTCUTS,
  TRACKING_PAGE,
  TRACKING_PAGE_CATEGORY,
  TRACKING_SHORTCUT_ACTION_PREFIX_NAME,
};
