import controller from './delete-objects.controller';
import template from './delete-objects.html';

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
