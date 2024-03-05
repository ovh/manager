import controller from './regions.controller';
import template from './regions.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    availableRegions: '<',
    guideUrl: '<',
    guideTrackingSectionTags: '<',
    trackClick: '<',
    projectId: '<',
    regions: '<',
    getStateName: '<',
    goToRegion: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
  },
  controller,
  template,
};
