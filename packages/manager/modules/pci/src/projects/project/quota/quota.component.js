import controller from './quota.controller';
import template from './quota.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    hasDefaultPaymentMethod: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackPage: '<',
    trackClick: '<',
    project: '<',
    projectId: '<',
    quotas: '<',
    region: '<',
    getStateName: '<',
    goToRegion: '<',
    serviceOptions: '<',
  },
  controller,
  template,
};
