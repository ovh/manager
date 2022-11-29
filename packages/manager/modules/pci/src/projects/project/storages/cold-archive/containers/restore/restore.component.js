import controller from './restore.controller';
import template from './restore.html';

export default {
  controller,
  template,
  bindings: {
    projectId: '<',
    container: '<',
    trackClick: '<',
    trackPage: '<',
    goBack: '<',
  },
};
