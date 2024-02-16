import ASK_INCREASE_PROJECTS_QUOTA from './assets/ask_increase_project_quota.png';
import VERIFY_PAYPAL from './assets/verify_paypal.png';

export const ELIGIBILITY_ACTION_ENUM = {
  ADD_PAYMENT_MEHTOD: 'addPaymentMethod',
  ASK_INCREASE_PROJECTS_QUOTA: 'askIncreaseProjectsQuota',
  CHALLENGE_PAYMENT_METHOD: 'challengePaymentMethod',
  VERIFY_PAYPAL: 'verifyPaypal',
};

export const ELIGIBILITY_ERROR_IMAGES_SRC = {
  ASK_INCREASE_PROJECTS_QUOTA,
  VERIFY_PAYPAL,
};

export const PCI_PROJECT_ORDER_CART = {
  productName: 'cloud',
  planCode: 'project.2018',
  infraConfigValue: 'production',
  creditPlanCode: 'cloud.credit',
};

export const PCI_PROJECT_STEPS = {
  CONFIGURATION: 'configuration',
  PAYMENT: 'payment',
};

export const PAYMENT_RUPAY_CREDIT_CARD_CHARGES_FEATURE_ID =
  'payments:rupay-message';

export const SUPPORT_URL = 'https://help.ovhcloud.com/csm?id=csm_get_help';

export default {
  ELIGIBILITY_ACTION_ENUM,
  ELIGIBILITY_ERROR_IMAGES_SRC,
  PCI_PROJECT_ORDER_CART,
  PCI_PROJECT_STEPS,
  PAYMENT_RUPAY_CREDIT_CARD_CHARGES_FEATURE_ID,
  SUPPORT_URL,
};
