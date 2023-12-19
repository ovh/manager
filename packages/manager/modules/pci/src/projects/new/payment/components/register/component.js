import template from './index.html';

export default {
  name: 'pciProjectNewPaymentRegister',
  template,
  bindings: {
    creditProvisioningPlan: '<',
    isDisplayablePaypalChargeBanner: '<',
    eligibility: '<',
    model: '<',
    registerablePaymentMethods: '<',
    globalLoading: '<',
    pciFeatures: '<',
    isDisplayableRupayCreditCardInfoBanner: '<',
    viewOptions: '<',
  },
};
