import controller from './git-view-last-deployment.controller';
import template from './git-view-last-deployment.html';

export default {
  bindings: {
    serviceName: '<',
    websiteId: '<',
    goBack: '<',
  },
  controller,
  template,
};
