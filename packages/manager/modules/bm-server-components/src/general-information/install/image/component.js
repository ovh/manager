import controller from './controller';
import template from './index.html';

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
