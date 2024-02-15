import controller from './edit-name.controller';
import template from './edit-name.html';

export default {
  bindings: {
    projectId: '<',
    loadbalancer: '<',
    region: '<',
    goBack: '<',
    trackAction: '<',
    trackPage: '<',
  },
  controller,
  template,
};
