import template from './git-removal.html';
import controller from './git-removal.controller';

export default {
  bindings: {
    goBack: '<',
    serviceName: '<',
    path: '<',
  },
  template,
  controller,
};
