import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPayment',
  controller,
  template,
  bindings: {
    callback: '<',
    creditProvisioningPlan: '<',
    isDisplayablePaypalChargeBanner: '<',
    cart: '<',
    reloadPayment: '<',
    getCancelHref: '<',
    step1Link: '<',
    getPaymentMethod: '<',
    eligibility: '<',
    model: '<',
    defaultPaymentMethod: '<',
    hasComponentRedirectCallback: '<',
    validPaymentMethods: '<',
    onCartFinalized: '<',
    onAskCreditPayment: '<',
    globalLoading: '<',
    paymentStatus: '<',
    trackClick: '<',
    trackPage: '<',
    sendTrack: '<',
    trackProjectCreationError: '<',
    onProgressStepClick: '<',
  },
};
