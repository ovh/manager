import controller from './billing.controller';
import template from './billing.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    billingLink: '<',
    consumption: '<',
    consumptionDetails: '<',
    currentActiveLink: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    historyLink: '<',
    projectId: '<',
  },
  controller,
  template,
};
