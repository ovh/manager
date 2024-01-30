import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    ip: '<',
    user: '<',
    goDashboard: '<',
    serverType: '<',
  },
  controller,
  template,
};
