export const BILLING_FEATURE = 'billing:management';
export const SIRET_BANNER_FEATURE = 'hub:banner-hub-invite-customer-siret';
export const SIRET_MODAL_FEATURE = 'hub:popup-hub-invite-customer-siret';
export const KYC_INDIA_FEATURE = 'identity-documents';
export const KYC_FRAUD_FEATURE = 'procedures:fraud';

export const features = [
  BILLING_FEATURE,
  SIRET_BANNER_FEATURE,
  SIRET_MODAL_FEATURE,
  KYC_INDIA_FEATURE,
  KYC_FRAUD_FEATURE,
];

export const BILLING_SUMMARY_PERIODS_IN_MONTHS = [1, 3, 6];

export const LINK = 'https://billing.us.ovhcloud.com/login';

export const KYC_FRAUD_TRACK_IMPRESSION = {
  campaignId: 'kyc-fraud',
  creation: 'notification',
  format: 'banner',
  generalPlacement: 'manager-hub',
};

export default {
  features,
  BILLING_SUMMARY_PERIODS_IN_MONTHS,
  LINK,
};
