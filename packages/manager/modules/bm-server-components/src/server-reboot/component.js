import controller from './server-reboot.controller';
import template from './server-reboot.html';

export default {
  bindings: {
    server: '<',
    goBack: '<',
  },
  controller,
  template,
};
