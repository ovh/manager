import controller from './ola-reset.controller';
import template from './ola-reset.html';

export default {
  bindings: {
    goBack: '<',
    alertError: '<',
    serverName: '<',
    ola: '<',
  },
  controller,
  template,
};
