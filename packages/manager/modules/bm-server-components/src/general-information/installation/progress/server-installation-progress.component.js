import controller from './server-installation-progress.controller';
import template from './server-installation-progress.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
    statePrefix: '<',
  },
  controller,
  template,
};
