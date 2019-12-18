const CA = {
  billing: 'https://ca.ovh.com/manager/#/billing/history',
  billingCredits: 'https://ca.ovh.com/manager/#/billing/credits',
  billingFidelity: 'https://ca.ovh.com/manager/#/billing/fidelity',
  billingPayments: 'https://ca.ovh.com/manager/#/billing/payments',
  billingRefunds: 'https://ca.ovh.com/manager/#/billing/payment/refunds',
  billingVouchers: 'https://ca.ovh.com/manager/#/billing/payment/vouchers',
  contacts: null, // not yet available to CA users
  orders: 'https://ca.ovh.com/manager/#/billing/orders?status=all',
  ovhAccount: 'https://ca.ovh.com/manager/#/billing/payment/ovhaccount',
  paymentMeans: 'https://ca.ovh.com/manager/#/billing/payment/method',
  services: 'https://ca.ovh.com/manager/#/billing/autorenew',
  servicesAgreements: 'https://ca.ovh.com/manager/#/useraccount/agreements',
  userAdvanced: 'https://ca.ovh.com/manager/#/useraccount/advanced',
  userEmails: 'https://ca.ovh.com/manager/#/useraccount/emails',
  userInfos: 'https://ca.ovh.com/manager/#/useraccount/infos',
  userSecurity: 'https://ca.ovh.com/manager/#/useraccount/security',
  userSubscriptions: 'https://ca.ovh.com/manager/#/useraccount/subscriptions',
  userSSH: 'https://ca.ovh.com/manager/#/billing/autorenew/ssh',
};

const EU = {
  billing: 'https://www.ovh.com/manager/dedicated/#/billing/history',
  billingCredits: 'https://www.ovh.com/manager/dedicated/#/billing/credits',
  billingFidelity: 'https://www.ovh.com/manager/dedicated/#/billing/fidelity',
  billingPayments: 'https://www.ovh.com/manager/dedicated/#/billing/payments',
  billingRefunds: 'https://www.ovh.com/manager/dedicated/#/billing/refunds',
  billingVouchers: 'https://www.ovh.com/manager/dedicated/#/billing/vouchers',
  contacts: 'https://www.ovh.com/manager/dedicated/#/contacts/services',
  orders: 'https://www.ovh.com/manager/dedicated/#/billing/orders?status=all',
  ovhAccount: 'https://www.ovh.com/manager/dedicated/#/billing/ovhaccount',
  paymentMeans: 'https://www.ovh.com/manager/dedicated/#/billing/payment/method',
  services: 'https://www.ovh.com/manager/dedicated/#/billing/autorenew',
  servicesAgreements: 'https://www.ovh.com/manager/dedicated/#/billing/autorenew/agreements',
  userAdvanced: 'https://www.ovh.com/manager/dedicated/#/useraccount/advanced',
  userEmails: 'https://www.ovh.com/manager/dedicated/#/useraccount/emails',
  userInfos: 'https://www.ovh.com/manager/dedicated/#/useraccount/infos',
  userSecurity: 'https://www.ovh.com/manager/dedicated/#/useraccount/security',
  userSubscriptions: 'https://www.ovh.com/manager/dedicated/#/useraccount/subscriptions',
  userSSH: 'https://www.ovh.com/manager/dedicated/#/billing/autorenew/ssh',
};

const US = {
  billing: 'https://us.ovhcloud.com/manager/dedicated/#/billing/history',
  billingCredits: 'https://us.ovhcloud.com/manager/dedicated/#/billing/payment/credits',
  billingEnterprise: 'https://billing.us.ovhcloud.com/login',
  billingFidelity: 'https://us.ovhcloud.com/manager/dedicated/#/billing/fidelity',
  billingPayments: 'https://us.ovhcloud.com/manager/dedicated/#/billing/payments',
  billingRefunds: 'https://us.ovhcloud.com/manager/dedicated/#/billing/payment/refunds',
  billingVouchers: 'https://us.ovhcloud.com/manager/dedicated/#/billing/payment/vouchers',
  contacts: null, // not yet available to US users
  orders: 'https://us.ovhcloud.com/manager/dedicated/#/billing/orders?status=all',
  ovhAccount: 'https://us.ovhcloud.com/manager/dedicated/#/billing/ovhaccount',
  paymentMeans: 'https://us.ovhcloud.com/manager/dedicated/#/billing/mean',
  services: 'https://us.ovhcloud.com/manager/dedicated/#/billing/autorenew',
  servicesAgreements: 'https://us.ovhcloud.com/manager/dedicated/#/billing/autorenew/agreements',
  userAdvanced: 'https://us.ovhcloud.com/manager/dedicated/#/useraccount/advanced',
  userEmails: 'https://us.ovhcloud.com/manager/dedicated/#/useraccount/emails',
  userInfos: 'https://us.ovhcloud.com/manager/dedicated/#/useraccount/infos',
  userSecurity: 'https://us.ovhcloud.com/manager/dedicated/#/useraccount/security',
  userSubscriptions: 'https://us.ovhcloud.com/manager/dedicated/#/useraccount/subscriptions',
  userSSH: 'https://us.ovhcloud.com/manager/dedicated/#/billing/autorenew/ssh',
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
