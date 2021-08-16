import controller from './billing-legacy.controller';
import template from './billing-legacy.html';

export default {
  bindings: {
    billingLink: '<',
    estimateLink: '<',
    historyLink: '<',
    currentActiveLink: '<',
    guideUrl: '<',
    projectId: '<',
  },
  controllerAs: 'BillingCtrl',
  controller,
  template,
};
