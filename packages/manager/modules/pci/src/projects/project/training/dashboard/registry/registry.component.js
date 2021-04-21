import controller from './registry.controller';
import template from './registry.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    userLink: '<',
    goToDashboard: '<',
    goBack: '<',
    regions: '<',
    currentRegion: '<',
  },
};
