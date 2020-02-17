export const AUTORENEW_URL = {
  EU: 'https://www.ovh.com/manager/dedicated/#/billing/autoRenew',
  CA: 'https://ca.ovh.com/manager/#/billing/autoRenew',
};

export const DEBT_STATUS = ['PENDING_DEBT', 'UN_PAID'];

export const DEFAULT_REGION = 'EU';

export const NUMBER_OF_RECORDS = 4;

export const SERVICE_STATES = {
  error: ['expired'],
  success: ['auto', 'automatic'],
  warning: ['manual', 'manualPayment', 'delete_at_expiration'],
};

export default {
  AUTORENEW_URL,
  DEBT_STATUS,
  DEFAULT_REGION,
  NUMBER_OF_RECORDS,
  SERVICE_STATES,
};
