import controller from './remove.controller';
import template from './remove.html';

export default {
  bindings: {
    defaultProject: '<',
    delete: '<',
    goBack: '<',
    unFavProject: '<',
    trackClick: '<',
    trackPage: '<',
    isDiscoveryProject: '<',
    projectId: '<',
    pciFeatures: '<',
  },
  controller,
  template,
};
