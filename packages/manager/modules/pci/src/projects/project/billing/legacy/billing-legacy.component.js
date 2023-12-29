import controller from './billing-legacy.controller';
import template from './billing-legacy.html';

export default {
  bindings: {
    isTrustedZone: '<',
    billingLink: '<',
    estimateLink: '<',
    historyLink: '<',
    currentActiveLink: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    pciFeatures: '<',
    projectId: '<',
  },
  controllerAs: 'BillingCtrl',
  controller,
  template,
};
