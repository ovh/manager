import controller from './git-deployment.controller';
import template from './git-deployment.html';

export default {
  bindings: {
    path: '<',
    serviceName: '<',
    goBack: '<',
  },
  controller,
  template,
};
