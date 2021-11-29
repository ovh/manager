import controller from './regions.controller';
import template from './regions.html';

export default {
  bindings: {
    pciFeatureRedirect: '<',
    availableRegions: '<',
    guideUrl: '<',
    projectId: '<',
    regions: '<',
    getStateName: '<',
    goToRegion: '<',
  },
  controller,
  template,
};
