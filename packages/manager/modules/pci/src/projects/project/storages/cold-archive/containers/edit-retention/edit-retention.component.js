import controller from './edit-retention.controller';
import template from './edit-retention.html';

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
