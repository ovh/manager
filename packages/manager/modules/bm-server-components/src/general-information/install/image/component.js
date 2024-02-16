import controller from './controller';
import template from './template.html';

export default {
  name: 'serverInstallImage',
  bindings: {
    loaders: '<',
    model: '<',
    server: '<',
    user: '<',
    goDashboard: '<',
  },
  controller,
  template,
};
