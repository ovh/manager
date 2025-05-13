import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPaymentMethodAdd',
  controller,
  template,
  bindings: {
    eligibility: '<',
    creditProvisioningPlan: '<',
    isDisplayablePaypalChargeBanner: '<',
    globalLoading: '<',
    model: '<',
    registerablePaymentMethods: '<',
    pciFeatures: '<',
    isDisplayableRupayCreditCardInfoBanner: '<',
    viewOptions: '<',
  },
};
