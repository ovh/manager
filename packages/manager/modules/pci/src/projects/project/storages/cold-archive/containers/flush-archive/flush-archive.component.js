import controller from './flush-archive.controller';
import template from './flush-archive.html';

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
