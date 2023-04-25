import controller from './archive.controller';
import template from './archive.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    container: '<',
    trackClick: '<',
    trackPage: '<',
    goBack: '<',
    regions: '<',
  },
};
