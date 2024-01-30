import controller from './server-installation-ovh.controller';
import template from './server-installation-ovh.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
    user: '<',
    serverType: '<',
  },
  controller,
  template,
};
