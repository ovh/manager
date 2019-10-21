const CA = {
  billing: 'https://ca.ovh.com/manager/index.html#/billing/history',
  billingCredits: 'https://ca.ovh.com/manager/index.html#/billing/credits',
  billingFidelity: 'https://ca.ovh.com/manager/index.html#/billing/fidelity',
  billingPayments: 'https://ca.ovh.com/manager/index.html#/billing/payments',
  billingRefunds: 'https://ca.ovh.com/manager/index.html#/billing/refunds',
  billingVouchers: 'https://ca.ovh.com/manager/index.html#/billing/vouchers',
  contacts: null, // not yet available to CA users
  orders: 'https://ca.ovh.com/manager/index.html#/billing/orders?status=all',
  ovhAccount: 'https://ca.ovh.com/manager/index.html#/billing/ovhaccount',
  paymentMeans: 'https://ca.ovh.com/manager/index.html#/billing/mean',
  services: 'https://ca.ovh.com/manager/index.html#/billing/autorenew',
  servicesAgreements: 'https://ca.ovh.com/manager/index.html#/useraccount/agreements',
  userAdvanced: 'https://ca.ovh.com/manager/index.html#/useraccount/advanced',
  userEmails: 'https://ca.ovh.com/manager/index.html#/useraccount/emails',
  userInfos: 'https://ca.ovh.com/manager/index.html#/useraccount/infos',
  userSecurity: 'https://ca.ovh.com/manager/index.html#/useraccount/security',
  userSubscriptions: 'https://ca.ovh.com/manager/index.html#/useraccount/subscriptions',
  userSSH: 'https://ca.ovh.com/manager/index.html#/useraccount/ssh',
};

const EU = {
  billing: 'https://www.ovh.com/manager/dedicated/index.html#/billing/history',
  billingCredits: 'https://www.ovh.com/manager/dedicated/index.html#/billing/credits',
  billingFidelity: 'https://www.ovh.com/manager/dedicated/index.html#/billing/fidelity',
  billingPayments: 'https://www.ovh.com/manager/dedicated/index.html#/billing/payments',
  billingRefunds: 'https://www.ovh.com/manager/dedicated/index.html#/billing/refunds',
  billingVouchers: 'https://www.ovh.com/manager/dedicated/index.html#/billing/vouchers',
  contacts: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/contacts?tab=SERVICES',
  orders: 'https://www.ovh.com/manager/dedicated/index.html#/billing/orders?status=all',
  ovhAccount: 'https://www.ovh.com/manager/dedicated/index.html#/billing/ovhaccount',
  paymentMeans: 'https://www.ovh.com/manager/dedicated/index.html#/billing/mean',
  services: 'https://www.ovh.com/manager/dedicated/index.html#/billing/autorenew',
  servicesAgreements: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/agreements',
  userAdvanced: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/advanced',
  userEmails: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/emails',
  userInfos: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/infos',
  userSecurity: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/security',
  userSubscriptions: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/subscriptions',
  userSSH: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/ssh',
};

const US = {
  billing: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/history',
  billingCredits: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/credits',
  billingEnterprise: 'https://billing.us.ovhcloud.com/login',
  billingFidelity: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/fidelity',
  billingPayments: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/payments',
  billingRefunds: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/refunds',
  billingVouchers: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/vouchers',
  contacts: null, // not yet available to US users
  orders: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/orders?status=all',
  ovhAccount: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/ovhaccount',
  paymentMeans: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/mean',
  services: 'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/autorenew',
  servicesAgreements: 'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/agreements',
  userAdvanced: 'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/advanced',
  userEmails: 'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/emails',
  userInfos: 'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/infos',
  userSecurity: 'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/security',
  userSubscriptions: 'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/subscriptions',
  userSSH: 'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/ssh',
};

export const USER_MENU_URLS = {
  CA,
  EU,
  US,
};

export const MAX_NAME_LENGTH = 10;

export default {
  MAX_NAME_LENGTH,
  USER_MENU_URLS,
};
