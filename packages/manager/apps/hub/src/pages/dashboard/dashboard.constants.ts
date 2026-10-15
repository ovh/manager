export const BILLING_FEATURE = 'billing:management';
export const SIRET_BANNER_FEATURE = 'hub:banner-hub-invite-customer-siret';
export const SIRET_MODAL_FEATURE = 'hub:popup-hub-invite-customer-siret';
export const KYC_INDIA_FEATURE = 'identity-documents';
export const KYC_FRAUD_FEATURE = 'procedures:fraud';
export const CRITICAL_INFO_BANNER_FEATURE = 'hub:banner-critical-info';
// Shared with the invoices page of the billing application, so a single switch
// drives the banner in both places.
export const INVOICE_DELAY_BANNER_FEATURE = 'billing:invoiceDelayBanner';

export const features = [
  BILLING_FEATURE,
  SIRET_BANNER_FEATURE,
  SIRET_MODAL_FEATURE,
  KYC_INDIA_FEATURE,
  KYC_FRAUD_FEATURE,
  CRITICAL_INFO_BANNER_FEATURE,
  INVOICE_DELAY_BANNER_FEATURE,
];

// The invoicing run straddles the month boundary: the banner shows from the
// 28th of a month up to and including the 7th of the next one.
export const INVOICE_DELAY_BANNER_OPENING_DAY = 28;
export const INVOICE_DELAY_BANNER_CLOSING_DAY = 7;

export const BILLING_SUMMARY_PERIODS_IN_MONTHS = [1, 3, 6];

export const LINK = 'https://billing.us.ovhcloud.com/login';

export const NOTIFICATIONS_LINKS = {};

export const KYC_FRAUD_TRACK_IMPRESSION = {
  campaignId: 'kyc-fraud',
  creation: 'notification',
  format: 'banner',
  generalPlacement: 'manager-hub',
};

export const USER_CERTIFICATES = {
  EMAIL_UNREACHABLE: 'email-unreachable',
} as const;

export default {
  features,
  BILLING_SUMMARY_PERIODS_IN_MONTHS,
  LINK,
  NOTIFICATIONS_LINKS,
};
